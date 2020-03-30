<?php
require_once dirname(__FILE__) . '/RegistrationScreens.php';
require_once dirname(__FILE__) . '/../ConnectDb.php';

//this class contains all the possible states that can be executed from the
//registration page index.
//check RegistrationScreens for all the internal methods
class PageScreens extends RegistrationScreens{
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
    //initialize the invite code, that is fethed later in this function
    $inviteCode = false;
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

    //initialize variables that will be injected into the page as a js global varaible
    $JSdata = ["invited" => false];
    //check if there is a valid code being passed as get parameter
    if(isset($_GET['invite']) &&
      is_string($_GET['invite']) &&
      strlen($_GET['invite']) === 16 ){
      //store the invite code in a session variable
      $this->setData([ 'inviteCode' => $_GET['invite'] ]);
      //retrieve invite informations from db
      $instance = ConnectDb::getInstance();
      $pdo = $instance->getConnection();
      $stmt = $pdo->prepare('SELECT i.code, i.classID, i.invitedBy, i.creationDate, i.lifespan, c.name FROM invite_codes i, class c WHERE i.code = ? and i.classID = c.ID');
      $stmt->execute([$_GET['invite']]);
      //check if the invite code exists
      if($stmt->rowCount() > 0){
        $row = $stmt->fetch();
        //check in case the invite has a lifespan, that it has not expired
        if($row['lifespan'] == 0 || time() - $row['creationDate'] < $row['lifespan']){
          //the invite is good.
          //if the user is logged, show the accept invite screen
          if(isset($_SESSION['__is_valid'])){
            $this->setScreen('acceptInvite', [
              'inviteCode' => $_GET['invite'],
              "invitedBy" => $row['invitedBy'],
              "className" => $row['name']
            ]);
            return false;
          }
          //if the user is not logged
          //create a session varaible that has nothing to do with this registration process
          //it will be used by the login apis in case the user click the login link to recognize that
          //the user was trying to use an invite code.
          $_SESSION['user_invitecode'] = $_GET['invite'];
          //prepare data that will be passed to js
          $JSdata = [
            "invited" => true,
            "inviteData" => [
              "invitedBy" => $row['invitedBy'],
              "className" => $row['name']
            ]
          ];
        }else{
          //the invite code has expired.
          //remove it from the database
          $stmt = $pdo->prepare('DELETE FROM invite_codes where code = ?');
          $stmt->execute([$_GET['invite']]);
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
      //invalid code
      if(isset($_GET['invite'])){
        $this->setScreen('inviteError', ['error' => "invalid_code_get"]);
        return false;
      }
      //there is no invite code. if the user is logged, redirect to home screen
      if(isset($_SESSION['__is_valid'])){
        header('location: ../account/');
        die();
      }

    }
    $this->setFrontData($JSdata);
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
    //on page refresh, go back to the original screen
    if(!$data['firstCall']){
      $this->setScreen('userForm', []);
      return 0;
    }else{
      $this->setData(['inviteCode' => $data['inviteCode']]);
      $this->setFrontData([ "invitedBy" => $data['invitedBy'], "className" => $data['className'] ]);
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
      /* echo($endTime - time()); */
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

    //increment refreshes counter
    $this->setData([
      'captchaRefreshes' => ($this->getData('captchaRefreshes') +1)
    ]);

    if($this->getData('captchaRefreshes') > 10 || $this->getData( 'wrongCaptchaAttempts' ) > 10){
      //ratelimit the user for 60 seconds
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
    //go back to the first screen
    $this->setScreen('userForm', []);
    return 0;
  }

}
