import React from 'react';
// import zxcvbn from 'zxcvbn';
import lpse from  '../../utils/lpse.js';
import t from '../../utils/i18n.js';
import {register} from '../../utils/apiResolver.js';
import FormErrorMessage from '../../components/FormErrorMessage.js';
import FormInput from '../../components/FormInput.js';
import FormPasswordInfo from './FormPasswordInfo.js';

function FirstRegistrationStep(props){
  let inviteData = props.phpData.invited ? props.phpData.inviteData : {};
  let [errorMessage, setErrorMessage] = React.useState("");
  let [passwordState, setPasswordState] = React.useState(false);
  let [audit, setAudit] = React.useState({score: 0});
  let [loading, setLoading] = React.useState(false);

  let formReducer = (state, action)=>{
    if(action.password){
      let password = action.password || " ";
      validatePassword(password);
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

  async function validatePassword(password){
    let options = {
      timeout: 3000,
      breaches: true
    };
    let audit = await lpse(password, options)
    setAudit(audit);
    setPasswordState(
      <FormPasswordInfo audit={audit}/>
    );
  }

  async function validateForm(){
    let mailRe = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
    if(form.fullName.length < 3){
      error(t("invalid name"));
    }
    else if(! (form.mail.length > 3 && mailRe.test(form.mail))){
      error(t("invalid mail"));
    }
    else if(audit.score < 2){
      error(t( "weak password" ));
    }
    else if(form.password.length >= 200){
      error(t("password too long", {maxLength: 200}))
    }
    else if(form.password !== form.confirmPassword){
      error(t("confirm password wrong"))
    }else{
      if(errorMessage) error("");
      //send data to the register api. If there is no error, call the callback otherwise display it
      setLoading(true);
      let response = false;
      try{
        response = await register({
          step: 0,
          ...form
        });
      }catch(e){
        console.log(e);
        error(t('connection error'));
        setLoading(false);
      }
      if(response.error){
        //TODO: replace these errors with the relevant ones for the registration
        error(response.error=='wrong_mail_or_password'?t('incorrect username or password') : response.error);
        setLoading(false);
      }else if(response.success){
        setLoading(false);
        props.callback(response);
      }
      console.log(response);
    }
  }

  let button = loading?
  (
    <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
  ) : (
    <button className="btn"
    onClick={validateForm}
    aria-label={t("registration next")}
    >{t("registration next")}</button>
  )
  return(
  <>
    <header></header>
    <div className="register-container">
    <div className="top-header">
    {
      props.phpData.invited ?
      <h2>{t("register invite notice", {name:inviteData.invitedBy,classroom: inviteData.className})}</h2> :
      <h2>{t("register title")}</h2>
    }
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

    {button}

    </div>
  </>
  );
}

export default FirstRegistrationStep;
