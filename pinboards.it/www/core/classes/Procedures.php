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

  public static function joinClass(int $classID, string $userMail, boolean $admin){
    //TODO: leave the current class, check if it has to be deleted, join the new class
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
