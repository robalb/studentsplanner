<?php
//a state machine for handling registration steps
//each step is a 'screen'. the first screen is the user registration screen.

//each screen lives in 3 places: in the frontend, in the api interface for the frontend,
//and in the code executed in the index page.
//
//this class exposes methods to get the current screen, set the screen, or refresh the current screen.
//session variables used specifically for the registration are handled via the protected methods
//getData and setData, to keep the code as clean as possible of global variables
//
//the method seFrontData can be called to specify the data that will be passed to the frontend.
//the method getFrontData returns that data
class RegistrationScreens {
  private $firstScreen;
  private $setFrontDataCalls;
  private $firstFrontData;
  public function __construct(){
    $this->setFrontDataCalls = 0;
  }

  //get the name of the current screen
  public function getCurrentScreen(){
    if(isset($_SESSION['registrationScreen_current'])){
      return $_SESSION['registrationScreen_current'];
    }
    return false;
  }

  //call this method from within a screen to change screen and execute the new one.
  //or from outside to set and execute a screen
  public function setScreen(string $screenName, $data){
    if(!isset($_SESSION['registrationScreen_back'])){
      $_SESSION['registrationScreen_back'] = [];
    }
    $_SESSION['registrationScreen_current'] = $screenName;
    $_SESSION['registrationScreen_front'] = [];
    $data = array_merge( $data, [
        'firstCall' => true
      ]);
    $this->setFrontData(['screen' => $screenName]);
    $this->{$screenName}($data);
  }

  //call this method to execute the current screen
  public function refreshCurrentScreen($data = []){
    $screenName = $_SESSION['registrationScreen_current'];
    if(method_exists($this, $screenName)){
      //save a copy of the current frontdata before emptying it.
      //by doing this we can restore it
      //if the code in this refresh does not cange screen and does not call setFrontData
      $this->firstFrontData = $_SESSION['registrationScreen_front'];
      $this->firstScreen = $_SESSION['registrationScreen_current'];

      $_SESSION['registrationScreen_front'] = [];
      $data = array_merge( $data, [
        'firstCall' => false
      ]);
      $this->setFrontData(['screen' => $screenName]);
      $this->{$screenName}($data);

      //check if this screen called other screens:
      $calledOtherScreens = $this->firstScreen !== $_SESSION['registrationScreen_current'];
      //check if this screen called setFrontData
      $calledSetFrontData = $this->setFrontDataCalls > 1;
      if(!$calledOtherScreens && !$calledSetFrontData){
        //restore the old frontData
        $_SESSION['registrationScreen_front'] = $this->firstFrontData;
      }
    }
  }

  //get the data that has to be passed to the frontend of the current screen
  public function getFrontData(){
    return $_SESSION['registrationScreen_front'];
  }

  //set the data that has to be passed to the frontend of the current screen
  protected function setFrontData($data){
    $this->setFrontDataCalls++;
    $_SESSION['registrationScreen_front'] = array_merge(
      $_SESSION['registrationScreen_front'],
      $data);
  }

  //set a session variable (use this instead of a real session variable
  //so that the global scope is not polluted by too many variables
  //related to the registration)
  protected function setData($data){
    $_SESSION['registrationScreen_back'] = array_merge(
      $_SESSION['registrationScreen_back'],
      $data);
  }

  //get a registration - related session variable
  protected function getData($key){
    if(isset($_SESSION['registrationScreen_back'][$key])){
      return $_SESSION['registrationScreen_back'][$key];
    }
    return null;
  }

}
