import React from 'react';
import t from '../../utils/i18n.js';
import Button from '../../components/Button.js';

function FormPasswordInfo(props){
  let [showPasswordInfo, setShowPasswordInfo] = React.useState(false);
  let audit = props.audit;
  let strength = "password strength " + audit.score;
  let longInfo = {
    guesses: audit.guesses < 100000 ? audit.guesses : ("10^ "+Math.floor(audit.guesses_log10)) ,
    offline_slow_times_display: audit.crack_times_display.offline_slow_hashing_1e4_per_second,
    feedback_warning: audit.feedback.warning || "-",
    feedback_suggestion: audit.feedback.suggestions.join("\n") || "-"
  };
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
