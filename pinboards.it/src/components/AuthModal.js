import React from 'react';
import t from '../utils/i18n.js';
import {apiRequest} from '../utils/apiResolver.js';
import FormErrorMessage from './FormErrorMessage.js';
import FormInput from './FormInput.js';

import { sha256 } from '../utils/crypto.js';


function AuthModal(props){
  let [password, setPassword] = React.useState("");
  let [mail, setMail] = React.useState("");
  let [errorMessage, setErrorMessage] = React.useState("");
  let [loading, setLoading] = React.useState(false);
  //TODO: internal data validation. if valid, call received callback on click.
  let validateForm = ()=>{
    let mailRe = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
    if(! (mail.length > 3 && mailRe.test(mail))){
      error(t("invalid mail"));
    }
    else if(password.length < 6 || password.length > 200){
      error(t( "invalid password" ));
    }
    else{
      setLoading(true)
      if(errorMessage) error("");
      tryAuth();
    }
  }

  function error(message){
    setErrorMessage( <FormErrorMessage msg={message}/> )
  }
  
  async function tryAuth(){
    //Q: Why the fuck are you hashing client side?
    //A: Ok, i can explain: i am aware that by doing this, the hashed password is now the 
    //   password, and server side this hash has to be properly hashed using bcrypy.
    //   And talking of bcrypt, did you know that it has a cap of 55 characters per password? [0]
    //   This cap can be removed by hashing the password with sha256 first. [1]
    //Q: Ok, but calculating the sha256 client side is useless, because of the chicken-egg problem and stuff. [2]
    //A: Yes, in the curent state. But i'm planning to use the base code of this website for an app,
    //   and in that case it's not _that_ bad.
    //
    //   [0] https://security.stackexchange.com/questions/39849/does-bcrypt-have-a-maximum-password-length/39851#39851
    //   [1] https://security.stackexchange.com/questions/151297/using-sha-256-to-preprocess-password-before-bcrypt/151299
    //   [2] https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2011/august/javascript-cryptography-considered-harmful/
    let isHash = true;
    let hashedPassword = password;
    try{
      hashedPassword = await sha256(password);
    } catch(e){
      console.log(e)
      isHash = false
    }
    let data = {
      mail: mail,
      password: hashedPassword,
      isHash: isHash,
      getData: ['account', 'planner']
    }
    let response = await apiRequest('login', data, 'POST');
    setLoading(false);
    //the user got logged, probably from another tab. refresh the page
    if(response.error && response.error == 'session_error_refresh'){
      location.reload();
    }
    else if(response.error){
      error(t(response.error));
    }else if(response.success){
      props.auth(response);
    }
  }

  let button = loading?
  (
    <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
  ) : (
    <button className="btn"
    onClick={validateForm}
    tabIndex={3}
    aria-label={t("sign in")}
    >{t("sign in")}</button>
  )
  return(
    <div className="auth-modal-wrapper">
      <div className="auth-modal">
      <h2>{t("login greeting")}</h2>

      {errorMessage}

      <FormInput 
      onChange = {e=>setMail(e.target.value)}
      label={t("mail")}
      tabIndex={1}
      type={"mail"}
      />

      <FormInput 
      onChange = {e=>setPassword(e.target.value)}
      label={t("password")}
      tabIndex={2}
      onEnter={loading?()=>{}:validateForm}
      type={"password"}
      />

      {button}
      
      </div>
    </div>
  );
}

export default AuthModal;
