<?php
require_once dirname(__FILE__) . '/RegistrationScreens.php';
require_once dirname(__FILE__) . '/../ConnectDb.php';

class ApiScreens extends RegistrationScreens{
  protected function userForm($data){
    //initialize some variables that will be useful to track abuses in the registration process
    $wrongMailAttempts = $this->getData('wrongMailAttempts') ? $this->getData('wrongMailAttempts') : 0;
    $wrongCodeAttempts = $this->getData('wrongCodeAttempts') ? $this->getData('wrongCodeAttempts') : 0;
    $wrongPasswordAttempts = $this->getData('wrongPasswordAttempts') ? $this->getData('wrongPasswordAttempts') : 0;
    //initialize the invite code, that is fetched when the page is reloaded
    $inviteCode = $this->getData('inviteCode') ? $this->getData('inviteCode') : false;
    $this->setData([
      //security varaibles
      'wrongMailAttempts' => $wrongMailAttempts,
      'wrongCodeAttempts' => $wrongCodeAttempts,
      'wrongPasswordAttempts' => $wrongPasswordAttempts,
      //invitation state
      'inviteCode' => $inviteCode
    ]);

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
        //check if the invite has not expired
        if(time() - $row['creationDate'] < $row['lifespan']){
          //the invite is good.
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
        //if there have been too many attempts
        if($errors > 3){
          $this->setData(['wrongCodeAttempts' => 0]);
          $this->setScreen('captcha', []);
          return false;
        }
        $this->setScreen('inviteError', ['error' => "invalid_code"]);
        return false;
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
        http_response_code(400);
        echo json_encode(['error'=>'mail_already_exists']);
        die();
      }else{
        //the mail is available, understand what is the next screen, and redirect to it
        $password = $data['password'];
        //handle the case where the client couldn't send a hashed password
        if(isset($data["isHash"]) && $data["isHash"] == false){
          $password = hash("sha256", $password);
        }
        $screenData = [
          'fullName' => $data['fullName'],
          'hash' => $password,
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
    }else{
      $this->setFrontData([ 'error' => $data['error'] ]);
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
        $rateLimitTime = $captchasSolved * 60;
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
    //if this is the first call, store in a session variable the passed user data
    if($data['firstCall']){
      $this->setData([
        'hash' => $data['hash'],
        'fullName' => $data['fullName'],
        'invited' => $data['invited'],
        'mail' => $data['mail'],
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
        'invited' => $this->getData( 'invited' ),
        'mail' => $this->getData( 'mail' ),
        'classID' => $this->getData( 'classID' )
      ];
      $this->setScreen('ok', $returnData);
      return 0;
    }
  }


  protected function mailConfirmation($data){
  }

  protected function ok($data){
    //if this is the first call, proceed to register the user
    if($data['firstCall']){
      //TODO
      //consider:
      //at the end of the registration, destroying the user session
      //at the beginning of the registration, performing user trust analisys
    }else{
      //go back to the first screen
      $this->setScreen('userForm', []);
    }
  }

}
