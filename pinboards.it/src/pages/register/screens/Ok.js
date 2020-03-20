import React from 'react';
import t from '../../../utils/i18n.js';

function Ok(props){
  return (
    <>
      <div className="register-container">
      <h2>{t("registration successfull")}</h2>
      <p> {t("login from registration link text")} <a href="../account/">{t("login button")}</a> </p>
      </div>
    </>
  );
}

export default Ok;
