<?php
require_once dirname(__FILE__) . '/RegistrationScreens.php';
require_once dirname(__FILE__) . '/../ConnectDb.php';
require_once dirname(__FILE__) . '/../LanguageManager.php';
require_once dirname(__FILE__) . '/../Procedures.php';

class ApiScreens extends RegistrationScreens{
  protected function userForm($data){
    //unset a session variable that is used by the login apis to know if they should
    //redirect back here after a login (useful for the case where a user visit an invitation link, is not logged, but has an account)
    $_SESSION['user_invitecode'] = false;
    //initialize some variables that will be useful to track abuses in the registration process
    $wrongMailAttempts = $this->getData('wrongMailAttempts') ? $this->getData('wrongMailAttempts') : 0;
    $wrongCodeAttempts = $this->getData('wrongCodeAttempts') ? $this->getData('wrongCodeAttempts') : 0;
    $wrongPasswordAttempts = $this->getData('wrongPasswordAttempts') ? $this->getData('wrongPasswordAttempts') : 0;
    $accountsCreated = $this->getData('accountsCreated') ? $this->getData('accountsCreated') : 0;
    $registrationCompleted = $this->getData('registrationCompleted') ? $this->getData('registrationCompleted') : false;
    //initialize the invite code, that is fetched when the page is reloaded
    $inviteCode = $this->getData('inviteCode') ? $this->getData('inviteCode') : false;
    $this->setData([
      //security varaibles
      'wrongMailAttempts' => $wrongMailAttempts,
      'wrongCodeAttempts' => $wrongCodeAttempts,
      'wrongPasswordAttempts' => $wrongPasswordAttempts,
      'accountsCreated' => $accountsCreated,
      'registrationCompleted' => $registrationCompleted,
      //invitation state
      'inviteCode' => $inviteCode
    ]);

    //ratelimit the user if this is not the first time they create an account
    if($data['firstCall'] && $this->getData('registrationCompleted')){
      $this->setData(['registrationCompleted' => false]);
      $accountsCreated = $this->getData('accountsCreated');
      //if less than 3 accounts have benn created, just show a captcha
      //otherwise ratelimit the user with an incremental time
      if($accountsCreated < 3){
        $this->setScreen('captcha', []);
        return 0;
      }else{
        $this->setScreen('error', ['time' => $accountsCreated * 30]);
        return 0;
      }
    }

    //data that will be used when the user is successfuly authenticated
    //to determine what is the next screen
    $invited = false;
    $classID = false;

    //before performing any check on the user submitted form,
    //check the validity of the invite code. if it's bad, redirect to the inviteError screen
    $invite = $this->getData('inviteCode');
    if($invite){
      //retrieve invite informations from db
      $instance = ConnectDb::getInstance();
      $pdo = $instance->getConnection();
      $stmt = $pdo->prepare('SELECT i.code, i.classID, i.invitedBy, i.creationDate, i.lifespan, c.name FROM invite_codes i, class c WHERE i.code = ? and i.classID = c.ID');
      $stmt->execute([$invite]);
      //check if the invite code exists
      if($stmt->rowCount() > 0){
        $row = $stmt->fetch();
        //check in case the invite has a lifespan, that it has not expired
        if($row['lifespan'] == 0 || time() - $row['creationDate'] < $row['lifespan']){
          //the invite is good.
          //if the user is logged, show the accept invite screen
          if(isset($_SESSION['__is_valid'])){
            $this->setScreen('acceptInvite', [
              'inviteCode' => $invite,
              "invitedBy" => $row['invitedBy'],
              "className" => $row['name']
            ]);
            return false;
          }
          //if the user is not logged
          //create a session varaible that has nothing to do with this registration process
          //it will be used by the login apis in case the user click the login link to recognize that
          //the user was trying to use an invite code.
          $_SESSION['user_invitecode'] = $invite;
          //update the related variables
          $invited = true;
          $classID = $row['classID'];
          $this->setFrontData([
            "invited" => true,
            "inviteData" => [
              "invitedBy" => $row['invitedBy'],
              "className" => $row['name']
            ]
          ]);
        }else{
          //the invite code has expired.
          //remove it from the database
          $stmt = $pdo->prepare('DELETE FROM invite_codes where code = ?');
          $stmt->execute([$invite]);
          //set the current state to inviteError
          $this->setScreen('inviteError', ['error' => "expired_code"]);
          return false;
        }
      }else{
        //the invite code does not exist.
        //increment the error counter, stored in this screen session data
        $errors = $this->getData('wrongCodeAttempts');
        $errors += 1;
        $this->setData(['wrongCodeAttempts' => $errors]);
        //set the appropriate response code. this will be useful for fail2ban ip ban, o simply log analysis
        http_response_code(401);
        //if there have been too many attempts
        if($errors > 3){
          $this->setData(['wrongCodeAttempts' => 0]);
          $this->setScreen('captcha', []);
          return false;
        }
        $this->setScreen('inviteError', ['error' => "invalid_code"]);
        return false;
      }
    }else{
      //there is no invite code. if the user is logged, redirect to home screen
      if(isset($_SESSION['__is_valid'])){
        //return a session error that in the frontend code will trigger
        //a redirect to the account page
        http_response_code(400);
        echo json_encode(['error'=>'session_error_refresh']);
        die();
      }
    }

    //check the user submitted data
    if(!$data['firstCall']){
      $error = 0;
      //check mail existance and max length
      $error += !(isset($data['mail']) && strlen($data['mail']) < 150 );
      //check password existence and length
      $error += !(isset($data['password']) && strlen($data['password']) < 200 );
      //check fullName existence and length
      $error += !(isset($data['fullName']) && strlen($data['fullName']) > 2 && strlen($data['fullName']) < 100 );
      //chek mail validity and create filtered mail variable
      if(isset($data['mail'])){
        $mail = filter_var($data['mail'], FILTER_SANITIZE_EMAIL);
        $error += !$mail;
      }
      if($error !== 0){
        http_response_code(400);
        echo json_encode(['error'=>'malformed_request']);
        die();
      }
      //check if the mail is available.
      $instance = ConnectDb::getInstance();
      $pdo = $instance->getConnection();
      $stmt = $pdo->prepare('SELECT fullName FROM students WHERE mail = ?');
      $stmt->execute([$mail]);
      //if the mail is not available
      if($stmt->rowCount() > 0){
        //increment the mail error counter
        $wrongMailAttempts = $this->getData('wrongMailAttempts');
        $wrongMailAttempts++;
        $this->setData(['wrongMailAttempts' => $wrongMailAttempts]);
        //if there have been too many attempts
        if($wrongMailAttempts > 3){
          $this->setData(['wrongMailAttempts' => 0]);
          $this->setScreen('captcha', []);
          return 0;
        }
        //otherwise return an error
        http_response_code(401);
        echo json_encode(['error'=>'mail_already_exists']);
        die();
      }else{
        //the mail is available, understand what is the next screen, and redirect to it
        $password = $data['password'];
        //handle the case where the client couldn't send a hashed password
        if(isset($data["isHash"]) && $data["isHash"] == false){
          $password = hash("sha256", $password);
        }
        //prepare the hash of the password hash, in the format that will be stored in the db
        $config = require dirname(__FILE__).'/../../config/config.php';
        $cost = $config['bcryptCost'];
        $options = [ 'cost' => $cost, ];
        $password = password_hash($password, PASSWORD_BCRYPT, $options);

        $screenData = [
          'hash' => $password,
          'fullName' => $data['fullName'],
          'mail' => $mail,
          'invited' => $invited,
          'classID' => $classID
        ];
        //if the user is invited, the next screen is the classForm, otherwise it's the final one
        $screen = $invited ? 'ok' : 'classForm';
        $this->setScreen($screen, $screenData);
        return 0;
      }
    }

  }

  protected function inviteError($data){
    //on page refresh, go back to the original screen
    if(!$data['firstCall']){
      $this->setScreen('userForm', []);
      return 0;
    }else{
      $logged = isset($_SESSION['__is_valid']);
      $this->setFrontData([ 'error' => $data['error'], "isLogged" => $logged ]);
    }
  }

  protected function acceptInvite($data){
    if($data['firstCall']){
      $this->setData(['inviteCode' => $data['inviteCode']]);
    }else{
      //handle malformed data case
      if(!$data['accept']){
        http_response_code(400);
        echo json_encode(['error'=>'malformed_request']);
        die();
      }
      $instance = ConnectDb::getInstance();
      $pdo = $instance->getConnection();
      $stmt = $pdo->prepare('SELECT i.code, i.classID, i.invitedBy, i.creationDate, i.lifespan, c.name FROM invite_codes i, class c WHERE i.code = ? and i.classID = c.ID');
      $stmt->execute([$this->getData('inviteCode')]);
      //check if the invite code exists
      if($stmt->rowCount() > 0){
        $row = $stmt->fetch();
        //check in case the invite has a lifespan, that it has not expired
        if($row['lifespan'] == 0 || time() - $row['creationDate'] < $row['lifespan']){
          //the invite is good
          //check that the user is not already in that class
          if($row['classID'] == $_SESSION['classID']){
            http_response_code(400);
            echo json_encode(['error'=>'already_in_class']);
            die();
          }
          //all good, change the user class
          $instance = ConnectDb::getInstance();
          $pdo = $instance->getConnection();
          $stmt = $pdo->prepare('UPDATE students SET classID = ?, admin = 0 WHERE mail = ?');
          $stmt->execute([
            $row['classID'],
            $_SESSION['mail']
          ]);
          if($stmt->rowCount() > 0){
            //DONE!
            //update the user session variables
            $_SESSION['classID'] = $row['classID'];
            $_SESSION['className'] = $row['name'];
            $_SESSION['isAdmin'] = false;
            $this->setFrontData(['success' => true]);
          }else{
            //there was an error
            http_response_code(400);
            echo("update query error");
            die();
          }
        }else{
          //the invite code has expired
          http_response_code(400);
          echo json_encode(['error'=>'expired_code']);
          die();
        }
      }else{
        //the invite code does not exist
        http_response_code(400);
        echo json_encode(['error'=>'invalid_code']);
        die();
      }
    }
  }

  protected function error($data){
    //rate limit the user with this session
    if($data['firstCall']){
      if(!isset($data['caller'])){
        $data['caller'] = 'captcha';
      }
      if(!isset($data['time'])){
        $data['time'] = 30;
      }
      $this->setData([
        'callerScreen' => $data['caller'],
        'limitEndTime' => (time() + $data['time'])
      ]);
    }else{
      $endTime = $this->getData('limitEndTime');
      if(time() > $endTime){
        //the time has passed, redirect back to the old screen
        $this->setScreen($this->getData('callerScreen'), []);
        return 0;
      }
    }
  }

  protected function captcha($data){
    //initialize variables that won't be resetted on successives first calls
    //of this screen
    $captchasSolved = $this->getData('captchasSolved') ? $this->getData('captchasSolved') : 0;
    $this->setData([
      'captchasSolved' => $captchasSolved
    ]);

    //if this is the first call
    if($data['firstCall']){
      //initialize variables
      $this->setData([
        'wrongCaptchaAttempts' => 0,
        'captchaRefreshes' => 0
      ]);
      //ratelimit the user if this is not the first time a captcha is requested.
      if($captchasSolved > 2 && $captchasSolved % 2 == 0){
        $rateLimitTime = $captchasSolved * 30;
        //increment solved counter (even tho it has not been solved yet, this is done
        //to prevent an infinite ratelimit)
        $this->setData([
          'captchasSolved' => ($this->getData('captchasSolved') +1)
        ]);
        $this->setScreen('error', ['time' => $rateLimitTime, 'caller' => 'captcha']);
        return 0;
      }
    }else{
      //check the user input
      if(isset($data['answer'])){
        if($data['answer'] === $this->getData('captchaAnswer')){
          //the captcha has been solved
          //increment solved counter
          $this->setData([
            'captchasSolved' => ($this->getData('captchasSolved') +1)
          ]);
          //change screen
          $this->setScreen('userForm', []);
          return 0;
        }else{
          //wrong answer
          //increment error counter
          $this->setData([
            'wrongCaptchaAttempts' => ($this->getData('wrongCaptchaAttempts') +1)
          ]);
        }
      }else if(isset($data['refresh'])){
        //increment refreshes counter
        $this->setData([
          'captchaRefreshes' => ($this->getData('captchaRefreshes') +1)
        ]);
      }
    }
    //generate random question - answer pair.
    //NOTE: this is just a temporary setup for testing purposes. not a real captcha.
    $value1 = rand(1,30);
    $value2 = rand(1,30);
    $question = "$value1 + $value2 = ";
    //it has been widely proved that internet bots can't perform integer operations.
    //i'm joking, but there are real websites that use this kind of captcha.
    $answer = (string) ($value1 + $value2);
    //set the random string in the session variable
    $this->setData(['captchaAnswer' => $answer]);
    //send the 'scrambled' random string to the user
    $this->setFrontData(['captchaQuestion' => $question]);

    //ratelimit the user if there have been too many refreshes or errors
    if($this->getData( 'captchaRefreshes' ) > 10 || $this->getData( 'wrongCaptchaAttempts' ) > 10){
      $this->setScreen('error', ['time' => 60]);
      return 0;
    }
  }

  protected function classForm($data){
    //if the user is logged, redirect to home screen
    if(isset($_SESSION['__is_valid'])){
      //return a session error that in the frontend code will trigger
      //a redirect to the account page
      http_response_code(400);
      echo json_encode(['error'=>'session_error_refresh']);
      die();
    }
    //if this is the first call, store in a session variable the passed user data
    if($data['firstCall']){
      $this->setData([
        'hash' => $data['hash'],
        'fullName' => $data['fullName'],
        'mail' => $data['mail'],
        'invited' => $data['invited'],
        'classID' => $data['classID']
      ]);
    }else{
      //check the user submitted data
      //check for a page back redirect
      if(isset($data['previousScreen'])){
        $this->setScreen('userForm', []);
        return 0;
      }
      //check for and validate class data form
      $error = 0;
      //check class name and length
      $error += !(isset($data['name']) && strlen($data['name']) < 26 && strlen($data['name']) > 1);
      if($error !== 0){
        http_response_code(400);
        echo json_encode(['error'=>'malformed_request']);
        die();
      }
      //data is good
      $returnData = [
        'hash' => $this->getData( 'hash' ),
        'fullName' => $this->getData( 'fullName' ),
        'mail' => $this->getData( 'mail' ),
        'invited' => $this->getData( 'invited' ),
        'className' => $data['name']
      ];
      $this->setScreen('ok', $returnData);
      return 0;
    }
  }


  protected function mailConfirmation($data){
    //if the user is logged, redirect to home screen
    if(isset($_SESSION['__is_valid'])){
      //return a session error that in the frontend code will trigger
      //a redirect to the account page
      http_response_code(400);
      echo json_encode(['error'=>'session_error_refresh']);
      die();
    }
  }

  protected function ok($data){
    //if the user is logged, redirect to home screen
    if(isset($_SESSION['__is_valid'])){
      //return a session error that in the frontend code will trigger
      //a redirect to the account page
      http_response_code(400);
      echo json_encode(['error'=>'session_error_refresh']);
      die();
    }
    //if this is the first call, proceed to register the user
    if($data['firstCall']){
      //expected from var_dump:
      //hash, fullName, mail,
      //invited:
      //- true: classID
      //- false: className
      if($data['invited']){
        $classID = $data['classID'];
      }else{
        //create a new class, and get its id
        $newClassID = Procedures::createClass($data['className'], $data['fullName']);
        $classID = $newClassID ? $newClassID : 0;
      }
      //prepare misc variables
      //registrationTimestamp
      $registrationTimestamp = time();
      //locale
      $languageManager = new LanguageManager();
      $locale = $languageManager->getNegotiatedUserLocale();
      //trustScore
      $trustScore = 100;

      $instance = ConnectDb::getInstance();
      $pdo = $instance->getConnection();
      $stmt = $pdo->prepare('INSERT INTO students VALUES (:classID, :mail, :password, :fullName, :uniqueName, :registrationTimestamp, :lastLoginTimestamp, :lastLoginIp, :admin, :locale, :trustScore)');
      $stmt->execute([
        //by default, the user is created without a class
        "classID" => 0,
        "mail" => $data['mail'],
        "password" => $data['hash'],
        "fullName" => $data['fullName'],
        "uniqueName" => '',
        "registrationTimestamp" => $registrationTimestamp,
        "lastLoginTimestamp" => 0,
        "lastLoginIp" => '',
        "admin" => false,
        "locale" => $locale,
        "trustScore" => $trustScore
      ]);
      if($stmt->rowCount() > 0){
        //TODO: call join class procedure, passing ($classID, $data['mail'], true)

        //success
        $this->setFrontData(['success'=>true]);
      }else{
        echo("saving error");
        die();
      }

      //increment the counter of accounts created within this session
      $this->setData([
        'accountsCreated' => $this->getData('accountsCreated') +1,
        'registrationCompleted' => true
      ]);
    }else{
      //go back to the first screen
      $this->setScreen('userForm', []);
    }
  }

}
