import React from 'react';
import t from '../../utils/i18n.js';
import Collapsible from '../../components/Collapsible.js';

function FormPasswordInfo(props){
  let audit = props.audit;
  let strength = "password strength " + audit.score;
  let longInfo = {
    guesses: audit.guesses < 100000 ? Math.floor(audit.guesses) : ("10^ "+Math.floor(audit.guesses_log10)) ,
    offline_slow_times_display: audit.crack_times_display.offline_slow_hashing_1e4_per_second,
    feedback_warning: audit.feedback.warning || "-",
    feedback_suggestion: audit.feedback.suggestions.join("\n") || "-"
  };
  return(
    <div className="password-state-container">
      <p>{t("password strength:")}<span>{t(strength)}</span></p>

      <Collapsible
        buttonTitle={t("more info")}
        maxHeight={300}
        aria-label={t("toggle password info")}
        label={t("toggle password info")}
        title={t("toggle password info")}
      >
        <p className={"content"}>{t("password long info", longInfo)}</p>
      </Collapsible>

    </div>
  );
}

export default FormPasswordInfo;
