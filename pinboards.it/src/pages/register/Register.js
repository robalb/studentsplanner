import React from 'react';
//page specific imports
import './register.css';
import {register} from '../../utils/apiResolver.js';

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

  //get the function for sending and receiving data from the registration apis
  function getSendApiData(screenName){
    if (!screenName) screenName = phpData.screen || "error";
    //return the async function that will be passed to the current screen component for api updates.
    //this async function has a closure over the current screen name. If the server response 
    //has a different screen name, a screen change is triggered
    return async function sendApiData(data){
      console.log(screenName)
      let response = false;
      try{
        response = await register(data);
      }catch(e){
        console.log(e);
      }
      if(response.screen && response.screen != screenName){
        console.log('changing screen from ', screenName, ' to ', response.screen)
        setScreen(response.screen, response);
        console.log('requesting death');
        return 'die';
      }else{
        console.log('passing response', response);
        return response;
      }
    }
  }

  function setScreen(screen, data){
    //if the screen is not valid, set an error screen as screen
    if(!screens[screen] || typeof screens[screen] !== 'function' ){
      screen = 'error';
      data = {error: 'screen not found'}
    }
    //generate the screen component, that will be stored is a state variable, and rendered
    let Component = screens[screen];
    setCurrentScreen(<Component data={data} sendApiData={getSendApiData(screen)} setScreen={setScreen} />);
  }

  //render the current screen
  return currentScreen;

}

export default Register;

