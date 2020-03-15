import React from 'react';
import t from '../../utils/i18n.js';
import FormErrorMessage from '../../components/FormErrorMessage.js';
import FormInput from '../../components/FormInput.js';
//page specific imports
import './register.css';


function Register(props){
  let phpData = {};
  if(PHP_GLOBALS){
    phpData = PHP_GLOBALS;
  }

  if(phpData.invited && phpData.error){
    let error = phpData.error;
    if(["invalid_code", "expired_code", "invalid_code_get"].includes(error)){
      error = t(error)
    }else{
      error = t("generic invite code error", {error: error})
    }
    return(
    <>
      <header></header>
      <div className="register-container error">
        <h3>{error}</h3>
        <p><a href="../">{t("home")}</a></p>
        <p> {t("login link text")} <a href="../account/">{t("login button")}</a> </p>
      </div>
    </>
    );
  }

  let pageTitle = phpData.invited ?
    ( <h2>{t("register invite notice", {name:phpData.inviteData.invitedBy,classroom: phpData.inviteData.className})}</h2>) :
    ( <h2>{t("register title")}</h2>);

  return(
  <>
    <header></header>
    <div className="register-container">
    <div className="top-header">
      {pageTitle}
      <p> {t("login link text")} <a href="../account/">{t("login button")}</a> </p>
    </div>


      <FormInput 
      onChange={e=>console.log(e.target.value)} 
      label={t("full name")}
      />

      <FormInput 
      onChange={e=>console.log(e.target.value)} 
      label={t("mail")}
      type={"mail"}
      />

      <FormInput 
      onChange={e=>console.log(e.target.value)} 
      label={t("password")}
      type={"password"}
      />

      <FormInput 
      onChange={e=>console.log(e.target.value)} 
      label={t("confirm password")}
      type={"password"}
      />

      <button className="btn"
      aria-label={t("registration next")}
      >{t("registration next")}</button>

    </div>
  </>
  );
}

export default Register;

