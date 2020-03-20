import React from 'react';
import t from '../../../utils/i18n.js';

function Ok(props){
  return (
    <>
      <div className="register-container">
      <h2>{t("registration successfull")}</h2>
      <p><a href="../account/">{t("login after registration button")}</a> </p>
      </div>
    </>
  );
}

export default Ok;
