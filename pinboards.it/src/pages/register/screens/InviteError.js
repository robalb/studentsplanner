import React from 'react';
import t from '../../../utils/i18n.js';

function InviteError(props){
  let data = props.data
  let error = "invite error";
  if(data.error){
    if(["invalid_code", "expired_code", "invalid_code_get"].includes(data.error)){
      error = t(data.error)
    }else{
      error = t("generic invite code error", {error: data.error})
    }
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

export default InviteError;
