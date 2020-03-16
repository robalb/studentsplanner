import React from 'react';
import t from '../../utils/i18n.js';
import FormErrorMessage from '../../components/FormErrorMessage.js';
import FormInput from '../../components/FormInput.js';

import FormPasswordInfo from './FormPasswordInfo.js';

function InvitedRegistration(props){
  let inviteData = props.inviteData;
  let [errorMessage, setErrorMessage] = React.useState("");
  let [passwordState, setPasswordState] = React.useState(false);

  let formReducer = (state, action)=>{
    if(action.password){
      validatePassword(action.password);
    }
    return ({...state, ...action});
  }
  let [form, dispatchForm] = React.useReducer(formReducer, {
    mail: "",
    password: "",
    confirmPassword: "",
    fullName: ""
  });

  function error(message){
    setErrorMessage( <FormErrorMessage msg={message}/> )
  }

  function validatePassword(password){
    if(password.length < 1){
      setPasswordState(false);
      return 0;
    }
    setPasswordState(
      <FormPasswordInfo password={password}/>
    );
  }

  function validateForm(){
    let mailRe = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
    if(form.fullName.length < 3){
      error(t("invalid name"));
    }
    else if(! (form.mail.length > 3 && mailRe.test(form.mail))){
      error(t("invalid mail"));
    }
    else if(form.password.length < 6){
      error(t( "invalid password" ));
    }
    else if(form.password !== form.confirmPassword){
      error(t("confirm password wrong"))
    }else{
      if(errorMessage) error("");
    }

  }
  return(
  <>
    <header></header>
    <div className="register-container">
    <div className="top-header">
      <h2>{t("register invite notice", {name:inviteData.invitedBy,classroom: inviteData.className})}</h2>
      <p> {t("login link text")} <a href="../account/">{t("login button")}</a> </p>
    </div>

    {errorMessage}

    <div className = "scalable">
      <FormInput 
      onChange={e=>dispatchForm({fullName: e.target.value})} 
      label={t("full name")}
      />

      <FormInput 
      onChange={e=>dispatchForm({mail: e.target.value})} 
      label={t("mail")}
      type={"mail"}
      />

      {passwordState || ""}

      <FormInput 
      onChange={e=>dispatchForm({password: e.target.value})} 
      label={t("password")}
      type={"password"}
      />

      <FormInput 
      onChange={e=>dispatchForm({confirmPassword: e.target.value})} 
      label={t("confirm password")}
      type={"password"}
      />
    </div>

      <button className="btn"
      onClick={validateForm}
      aria-label={t("registration next")}
      >{t("registration next")}</button>

    </div>
  </>
  );
}

export default InvitedRegistration;
