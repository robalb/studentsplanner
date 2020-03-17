import React from 'react';
import t from '../../utils/i18n.js';
//page specific imports
import './register.css';
import FirstRegistrationStep from './FirstRegistrationStep.js';


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

  function firstStepSuccess(data){
    //TODO: depending on the invited status, render another step, or redirect to the account page
  }

  return <FirstRegistrationStep callback={firstStepSuccess} phpData={phpData} />

}

export default Register;

