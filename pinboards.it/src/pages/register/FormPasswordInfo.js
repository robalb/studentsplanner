import React from 'react';
import t from '../../utils/i18n.js';
import Button from '../../components/Button.js';
import zxcvbn from 'zxcvbn';

function FormPasswordInfo(props){
  let [showPasswordInfo, setShowPasswordInfo] = React.useState(false);
  let audit = zxcvbn(props.password)
  console.log(audit)
  let strength = "password strength " + audit.score;
  let longInfo = {};
  return(
    <div className="password-state-container">
      <p>{t("password strength:")}<span>{t(strength)}</span></p>
      <Button 
      onClick={()=>setShowPasswordInfo(!showPasswordInfo)}
      aria-label={t("toggle password info")}
      label={t("toggle password info")}
      title={t("toggle password info")}
      >
        <i className="material-icons">keyboard_arrow_down</i>
        <p>{t("more info")}</p>
      </Button>
      <div className={"collapsible " + (showPasswordInfo?"":"collapsed")}>
        <p>{t("password long info", longInfo)}</p>
      </div>
    </div>
  );
}

export default FormPasswordInfo;
