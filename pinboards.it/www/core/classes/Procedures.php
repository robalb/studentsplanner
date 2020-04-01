<?php
require_once dirname(__FILE__) . '/ConnectDb.php';

//TODO: create class procedure:
//- create the class row, and rows in all the other tables such
//as invitecodes and plannerstates
//-return the class id
//
//TODO: create negotiate uid procedure
//- given a classID and a full name, finds the best uid.
//
class Procedures{

  public static function createClass(string $name, string $creatorFullName){
    $instance = ConnectDb::getInstance();
    $pdo = $instance->getConnection();
    //create the class
    $stmt = $pdo->prepare('INSERT INTO class (name, inviteCode) VALUES (?, ?)');
    $stmt->execute([
      $name,
      '000000'
    ]);
    if($stmt->rowCount() > 0){
      //the query was successful. create the invite code and the planner row, using the class id
      $insertid = $pdo->lastInsertId();
      //generate invite code
      $lifespan = 0;//0s means the code does not expire
      self::updateClassInviteCode($insertid, $creatorFullName);
      //generate plannerdata
      $stmt = $pdo->prepare("INSERT INTO planner_states (classID, stateHash) VALUES (?, '00000000')");
      $stmt->execute([ $insertid ]);
      //retun the class id
      return $insertid;
    }else{
      return false;
    }
  }

  public static function joinClass(int $classID, string $userMail, bool $admin){
    $instance = ConnectDb::getInstance();
    $pdo = $instance->getConnection();
    //delete the current class if it is empty
    $stmt = $pdo->prepare('DELETE FROM class WHERE ID = (SELECT classID FROM students WHERE mail = ?) AND (SELECT count(*) FROM students WHERE classID = (SELECT classID FROM students WHERE mail = ?)) < 2');
    $stmt->execute([$userMail, $userMail]);
    if($stmt->rowCount() > 0){
      //if the class was indeed empty, delete also its associated plannerstate and invitecodes
      $stmt = $pdo->prepare('DELETE FROM planner_states WHERE classID = (SELECT classID FROM students WHERE mail = ?)');
      $stmt->execute([$userMail]);
      //note: invitecodes are not indexed by id, this could be quite slow
      $stmt = $pdo->prepare('DELETE FROM invite_codes WHERE classID = (SELECT classID FROM students WHERE mail = ?)');
      $stmt->execute([$userMail]);
    }

    //get the unique name for the new class
    $uniqueName = self::negotiateName($classID, $userMail);
    //join the class
    $stmt = $pdo->prepare('UPDATE students SET classID = ?, uniqueName = ?, admin = ? WHERE mail = ?');
    $stmt->execute([
      $classID,
      $uniqueName,
      $admin,
      $userMail
    ]);
    if($stmt->rowCount() > 0){
      return $uniqueName;
    }else{
      return false;
    }
  }


  public static function negotiateName($classID, $userMail){
    $instance = ConnectDb::getInstance();
    $pdo = $instance->getConnection();
    //get the user name
    $stmt = $pdo->prepare('SELECT fullName FROM students WHERE mail = ?');
    $stmt->execute([$userMail]);
    if($stmt->rowCount() > 0){
      $row = $stmt->fetch();
      //prepare variables useful for the name analysis
      $fullName = $row['fullName'];
      $parts = explode(" ", $fullName);

      //case 1: the final name is the fullName
      $newName = $fullName;
      //case 2: the fullName is separated by a space. the final name is the second word after the space
      //(probably an idiotic move, but hey)
      if(count($parts) == 2) $newName = $parts[1];

      //now that the surname has been _cleverly_ obtained, we can check if such identifier already exists in the class
      $students = [];
      //fetch all the student in the class
      $stmt = $pdo->prepare('SELECT uniqueName, fullName FROM students WHERE classID = ? LIMIT 100');
      $stmt->execute([$classID]);
      if($stmt->rowCount() > 0){
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
          $students[] = [
            "uid" => $row["uniqueName"],
            "fullName" => $row["fullName"]
          ];
        }
      }
      //fix eventual conflicts (note: this is the first time in my life i write a do while in something that
      //is not an exercise and this tells a lot about our society)
      $round = 0;
      do{
        $round++;
        //check conflict
        $confict = false;
        $conflictName = "";
        foreach($students as $current){
          if($current['uid'] == $newName){
            $confict = true;
            /* echo($newName . "<br>"); */
            $conflictName = $current['fullName'];
            break;
          }
        }
        //if there was a confict:
        if($confict){
          //try 1: if the original name is separated by a space, use the initials of the first word unless the previous user has the exact same fullname
          if($round == 1 && count($parts) == 2 && $conflictName !== $fullName){
            $initial = strtoupper($parts[0][0]);
            $newName = "{$parts[1]} $initial.";
          }
          else{
            //try 2: add a number
            $number = $round + 1;
            //spot the bug
            $newName = "$newName $number";
          }
        }

      }while($confict == true && $round < 10);

      return $newName;
    }else{
      return false;
    }
  }


  public static function createInviteCode(int $classID, string $invitedBy, int $lifespan){
    //generate the code
    $bytesLength = 12;
    $default = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    $custom = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$$";
    $randomBytes = random_bytes($bytesLength);
    $randomString = base64_encode($randomBytes);
    $code = strtr($randomString, $default, $custom);
    //ad the code row in the db
    $instance = ConnectDb::getInstance();
    $pdo = $instance->getConnection();
    $stmt = $pdo->prepare('INSERT INTO invite_codes VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([
      $code, //code
      $classID,//classID
      $invitedBy,//invitedBy
      time(),//creationDate
      $lifespan //lifespan
    ]);
    //return the code on success, otherwise return false
    if($stmt->rowCount() > 0){
      return $code;
    }else{
      return false;
    }
  }

  public static function updateClassInviteCode(int $classID, string $invitedBy){
    //generate the invite code, and its database row
    $lifespan = 0;//0s means the code does not expire
    $code = self::createInviteCode($classID, $invitedBy, $lifespan);
    if($code){
      //if the code got created successfuly, 
      //delete the previous class invitecode, and set this as the main one
      $instance = ConnectDb::getInstance();
      $pdo = $instance->getConnection();
      $stmt = $pdo->prepare('DELETE FROM invite_codes WHERE code IN (SELECT inviteCode FROM class WHERE ID = ?)');
      $stmt->execute([$classID]);
      //set the new code
      $stmt = $pdo->prepare('UPDATE class SET inviteCode = ? WHERE id = ?');
      $stmt->execute([$code, $classID]);
    }
  }

}
