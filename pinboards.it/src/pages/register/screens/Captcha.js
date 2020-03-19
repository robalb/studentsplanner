import React from 'react';
import t from '../../../utils/i18n.js';
import FormInput from '../../../components/FormInput.js';
import Button from '../../../components/Button.js';

function Captcha(props){
  let [answer, setAnswer] = React.useState('');
  let [question, setQuestion] = React.useState('');
  let [loading, setLoading] = React.useState(false);

  React.useEffect(() =>{
    let data = props.data
    if(!data.captchaQuestion){
      data.captchaQuestion = "-";
    }
    setQuestion(data.captchaQuestion);
  });


  async function sendAnswer(refresh=false){
    setLoading(true);
    let response = false;
    let data = refresh ? {refresh: true} : {answer: answer};
    response = await props.sendApiData(data);
    setLoading(false);
    if(response && response.question){
      setQuestion(response.question);
    }
  }

  let controls = loading?
  (
    <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
  ) : (
    <>
      <FormInput 
      centered={false}
      onChange={e=> setAnswer(e.target.value)}
      onEnter={e => sendAnswer()}
      label={t("captcha answer")}
      type={"text"}
      />
      <Button 
      aria-label={t("refresh captcha")}
      title={t("refresh captcha")}
      onClick={e => sendAnswer(true)}
      >
        <i className="material-icons">refresh</i>
      </Button>
      <Button 
      onClick={e => sendAnswer()}
      aria-label={t("send captcha answer")}
      title={t("send captcha answer")}
      >{t("send")}</Button>
    </>
  )

  return(
  <>
    <header></header>
    <div className="register-container captcha">
      <h3>{t("captcha confirm text")}</h3>
      <p>{question}</p>
      <div className = "scalable controls">
        {controls}
      </div>
    </div>
  </>
  );
}

export default Captcha;
