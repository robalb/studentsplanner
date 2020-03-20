import React from 'react';
import t from '../../../utils/i18n.js';

function GenericError(props){
  let error = t("generic error")
  return(
  <>
    <div className="register-container error">
      <h3>{error}</h3>
      <p>{t("generic error hints")}</p>
      <p><a href="../">{t("home")}</a></p>
    </div>
  </>
  );
}

export default GenericError;
