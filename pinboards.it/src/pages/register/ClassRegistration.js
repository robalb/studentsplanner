import React from 'react';
import t from '../../utils/i18n.js';
import FormErrorMessage from '../../components/FormErrorMessage.js';
import FormInput from '../../components/FormInput.js';

function ClassRegistration(props){
  let inviteData = props.inviteData;
  let [errorMessage, setErrorMessage] = React.useState("");

  let formReducer = (state, action)=>{
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

  function validateForm(){
    let mailRe = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
    if(! (form.mail.length > 3 && mailRe.test(form.mail))){
      error(t("invalid mail"));
    }
    else if(form.password.length < 6){
      error(t( "invalid password" ));
    }
    else{
    }

  }

  return(
  <>
    <header></header>
    <div className="register-container">
    <div className="top-header">
      <h2>{t("register title")}</h2>
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

export default ClassRegistration;

