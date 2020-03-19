<?php
require_once dirname(__FILE__) . '/RegistrationScreens.php';
require_once dirname(__FILE__) . '/../ConnectDb.php';

//this class contains all the possible states that can be executed from the
//registration page index.
//check RegistrationScreens for all the internal methods
class PageScreens extends RegistrationScreens{
  protected function userForm($data){
    //initialize some variables that will be useful to track abuses in the registration process
    $wrongMailAttempts = $this->getData('wrongMailAttempts') ? $this->getData('wrongMailAttempts') : 0;
    $wrongCodeAttempts = $this->getData('wrongCodeAttempts') ? $this->getData('wrongCodeAttempts') : 0;
    $wrongPasswordAttempts = $this->getData('wrongPasswordAttempts') ? $this->getData('wrongPasswordAttempts') : 0;
    $this->setData([
      //security varaibles
      'wrongMailAttempts' => $wrongMailAttempts,
      'wrongCodeAttempts' => $wrongCodeAttempts,
      'wrongPasswordAttempts' => $wrongPasswordAttempts,
      //invitation state
      'fromInvite' => false,
      'classID' => false
    ]);
    //initialize variables that will be injected into the page as a js global varaible
    $JSdata = ["invited" => false];
    //check if there is a valid code being passed as get parameter
    if(isset($_GET['invite']) &&
      is_string($_GET['invite']) &&
      strlen($_GET['invite']) === 16 ){
      //retrieve invite informations from db
      $instance = ConnectDb::getInstance();
      $pdo = $instance->getConnection();
      $stmt = $pdo->prepare('SELECT i.code, i.classID, i.invitedBy, i.creationDate, i.lifespan, c.name FROM invite_codes i, class c WHERE i.code = ? and i.classID = c.ID');
      $stmt->execute([$_GET['invite']]);
      //check if the invite code exists
      if($stmt->rowCount() > 0){
        $row = $stmt->fetch();
        //check if the invite has not expired
        if(time() - $row['creationDate'] < $row['lifespan']){
          //the invite is good.
          //update the invitation related global variables
          $this->setData([
            'fromInvite' => true,
            'classID' => $row['classID']
          ]);
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
        //if there have been too many attempts
        if($errors > 5){
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
    }
    $this->setFrontData($JSdata);
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
      $this->setData([
        'callerScreen' => $data['caller'],
        'limitEndTime' => (time() + 60)
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
    //TODO: this is just a temporary test. change all this code

    //if this is the first call, set the variables to 0
    if($data['firstCall']){
      $this->setData([
        'wrongCaptchaAttempts' => 0,
        'captchaRefreshes' => 0
      ]);
    }
    //initialize variables that won't be resetted on successives first calls
    //of this screen
    $captchasSolved = $this->getData('captchasSolved') ? $this->getData('captchasSolved') : 0;
    $this->setData([
      'captchasSolved' => $captchasSolved
    ]);
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

    if($this->getData( 'captchaRefreshes' ) > 10 || $this->getData( 'wrongCaptchaAttempts' ) > 10){
      $this->setScreen('error', ['error' => '-']);
    }
  }

  protected function classForm($data){
  }

  protected function mailConfirmation($data){
  }

  protected function ok($data){
    //TODO: this is just a temporary test. change alll this code
    if(isset($data['initialData'])){
      $this->setFrontData(['dataSetOnlyOnce' => 42]);
    }
  }

}
