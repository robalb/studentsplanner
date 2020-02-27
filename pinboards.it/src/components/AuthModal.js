import React from 'react';
import {login} from '../utils/apiResolver.js';

function ErrorMessageDiv(props){
  return (
    <div className="error-message">
    <i className="material-icons">error</i>
    <p>{props.msg}</p>
    </div>
  );
}

function AuthModal(props){
  let [password, setPassword] = React.useState("");
  let [mail, setMail] = React.useState("");
  let [errorMessage, setErrorMessage] = React.useState("");
  let [loading, setLoading] = React.useState(false);
  //TODO: internal data validation. if valid, call received callback on click.
  let validateForm = ()=>{
    let mailRe = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
    if(! (mail.length > 3 && mailRe.test(mail))){
      error("invalid mail");
    }
    else if(password.length < 6){
      error("invalid password");
    }
    else{
      setLoading(true)
      error("");
      tryAuth();
    }
  }

  function error(message){
    setErrorMessage( <ErrorMessageDiv msg={message}/> )
  }
  
  async function tryAuth(){
    let response = false;
    try{
      response = await login(mail, password,["account","planner"])
    } catch(e){
      console.log(e);
      error('connection error');
      setLoading(false);
    }
    if(response.error){
      //TODO: integrate this with i18y
      error(response.error=='wrong_mail_or_password'?'incorrect username or password' : response.error);
      setLoading(false);
    }else if(response.success){
      error("")
      setLoading(false);
      props.auth(response);
    }
  }

  let button = loading?
  (
    <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
  ) : (
    <button className="btn"
    onClick={validateForm}
    tabIndex="3"
    aria-label={"sign in"}
    >sign in</button>
  )
  return(
    <div className="auth-modal-wrapper">
      <div className="auth-modal">
      <h2>please sign in to continue</h2>

      {errorMessage}

      <div className="input-group centered">
        <input id="a11y-input3"
        aria-labelledby="#a11y-input3"
        tabIndex="1"
        type="mail"
        onChange = {e=>setMail(e.target.value)}
        required/>
        <span className="bar"></span>
        <label htmlFor="a11y-input3">Mail</label>
      </div>

      <div className="input-group centered">
        <input id="a11y-input2"
        aria-labelledby="#a11y-input2"
        tabIndex="2"
        type="password"
        onChange = {e=>setPassword(e.target.value)}
        required/>
        <span className="bar"></span>
        <label htmlFor="a11y-input2">Password</label>
      </div>

      {button}
      
      </div>
    </div>
  );
}

export default AuthModal;
