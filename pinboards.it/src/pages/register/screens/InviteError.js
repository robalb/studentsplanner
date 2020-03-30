import React from 'react';
import t from '../../../utils/i18n.js';

function InviteError(props){
  let data = props.data
  let error = t('generic invite code error');
  if(data.error){
    error = t(data.error)
  }

  return(
  <>
    <div className="register-container error">
      <h3>{error}</h3>
      {
        data.isLogged ?
        <p><a href="../account">{t("back")}</a></p> :
        <>
          <p><a href="../">{t("home")}</a></p>
          <p> {t("login link text")} <a href="../account/">{t("login button")}</a> </p>
        </>
      }
    </div>
  </>
  );
}

export default InviteError;
