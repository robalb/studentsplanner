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
  // let [abortTools, setAbortTools] = React.useState({});
  let [currentScreen, setCurrentScreen] = React.useState(false);
  let [currentScreenName, setCurrentScreenName] = React.useState(false);
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

  //api for sending and receiving data from the api endpoint
  //associated to the current screen. If the response contains a different screen parameter
  //a change of screen is triggered
  async function sendApiData(data){
    data['screen'] = currentScreenName || phpData.screen || "error";
    let response = false;
    try{
      // response = await register(data, abortTools.signal);
      response = await register(data);
    }catch(e){
      console.log(e);
    }
    if(response.screen && response.screen != data['screen']){
      console.log('changing screen from ',data['screen'], ' to ', response.screen)
      setScreen(response.screen, response);
      console.log('requesting death');
      return 'die';
    }else{
      console.log('passing response', response);
      return response;
    }
  }

  function setScreen(screen, data){
    // if(abortTools.abortController){
    //   abortController.abort();
    // }
    // const abortController = new AbortController();
    // const signal = abortController.signal;
    // setAbortTools({signal, abortController});

    setCurrentScreenName(screen);
    if(!screens[screen] || typeof screens[screen] !== 'function' ){
      screen = 'error';
      data = {error: 'screen not found'}
    }
    let Component = screens[screen];
    setCurrentScreen(<Component data={data} sendApiData={sendApiData} setScreen={setScreen} />);
  }

  //render the current screen
  return currentScreen;

}

export default Register;

