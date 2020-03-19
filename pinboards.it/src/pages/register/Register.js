import React from 'react';
//page specific imports
import './register.css';

//import all the possible steps of the registration process
//note: lazy loading could be used, but almost all these steps are necessary, and 
//those that may be not are all very small components anyway
import UserForm from './screens/UserForm.js';
import InviteError from './screens/InviteError.js';
import GenericError from './screens/GenericError.js';
import Captcha from './screens/Captcha.js';
import ClassForm from './screens/ClassForm.js';
import MailConfirmation from './screens/MailConfirmation.js';
import Ok from './screens/Ok.js';


let screens = {
  userForm: UserForm,
  inviteError: InviteError,
  error : GenericError,
  captcha: Captcha,
  classForm: ClassForm,
  mailConfirmation: MailConfirmation,
  ok: Ok,
};


function Register(props){
  let [currentScreen, setCurrentScreen] = React.useState(false);
  let phpData = {};
  if(PHP_GLOBALS){
    phpData = PHP_GLOBALS;
  }

  //if a screen is not set, set the screen passed by php
  //a 'screen' is a state in the registration state-based system
  //i call it screen and not state because i started with this dumb name, and now i'm too lazy to rename everything.
  if(phpData.screen && !currentScreen){
    setScreen(phpData.screen, phpData)
  }

  function setScreen(screen, data){
    console.log(screen)
    if(!screens[screen] || typeof screens[screen] !== 'function' ){
      screen = 'error';
      data = {error: 'screen not found'}
    }
    let component = screens[screen]
    console.log(component)
    console.log(screen)
    let state = {
      data: data,
      setScreen: setScreen
    }
    setCurrentScreen(component(state));
  }

  //render the current screen
  return currentScreen;

  

}

export default Register;

