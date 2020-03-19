import React from 'react';
import t from '../../../utils/i18n.js';

function GenericError(props){
  let data = props.data
  if(!data.error){
    data.error = "-";
  }
  let error = t("generic error", {error: data.error})

  return(
  <>
    <header></header>
    <div className="register-container error">
      <h3>{error}</h3>
      <p>{t("generic error hints")}</p>
      <p><a href="../">{t("home")}</a></p>
    </div>
  </>
  );
}

export default GenericError;
