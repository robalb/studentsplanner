<?php
require_once dirname(__FILE__) . '/RegistrationScreens.php';
require_once dirname(__FILE__) . '/../ConnectDb.php';

class ApiScreens extends RegistrationScreens{
  protected function userForm($data){
  }

  protected function inviteError($data){
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
    var_dump($data);

    //initialize variables that won't be resetted on successives first calls
    //of this screen
    $captchasSolved = $this->getData('captchasSolved') ? $this->getData('captchasSolved') : 0;
    $this->setData([
      'captchasSolved' => $captchasSolved
    ]);

    //if this is the first call, set the variables to 0
    if($data['firstCall']){
      $this->setData([
        'wrongCaptchaAttempts' => 0,
        'captchaRefreshes' => 0
      ]);
    }else{
      //check the user input
      if(isset($data['answer'])){
        if($data['answer'] === $this->getData('captchaAnswer')){
          echo(123);
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


    if($this->getData( 'captchaRefreshes' ) > 10 || $this->getData( 'wrongCaptchaAttempts' ) > 10){
      $this->setScreen('error', ['error' => '-']);
    }
  }

  protected function classForm($data){
  }

  protected function mailConfirmation($data){
  }

  protected function ok($data){
  }

}
