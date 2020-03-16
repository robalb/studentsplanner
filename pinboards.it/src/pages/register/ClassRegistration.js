import React from 'react';
import t from '../../utils/i18n.js';
import FormErrorMessage from '../../components/FormErrorMessage.js';
import FormInput from '../../components/FormInput.js';

function ClassRegistration(props){
  let inviteData = props.inviteData;
  return(
  <>
    <header></header>
    <div className="register-container">
    <div className="top-header">
      <h2>{t("register title")}</h2>
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
      onClick={validateForm}
      >{t("registration next")}</button>

    </div>
  </>
  );
}

export default ClassRegistration;

