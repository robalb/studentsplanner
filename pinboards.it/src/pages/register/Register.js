import React from 'react';
import t from '../../utils/i18n.js';
//page specific imports
import './register.css';
import InvitedRegistration from './InvitedRegistration.js';
import ClassRegistration from './ClassRegistration.js';


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

  return phpData.invited ? 
    <InvitedRegistration inviteData={phpData.inviteData} /> :
    <ClassRegistration inviteData={phpData.inviteData} /> ;
}

export default Register;

