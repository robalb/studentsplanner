import React from 'react';
import t from '../../../utils/i18n.js';
import FormInput from '../../../components/FormInput.js';
import FormErrorMessage from '../../../components/FormErrorMessage.js';


function ClassForm(props){
  let [loading, setLoading] = React.useState(false);
  let [name, setName] = React.useState('');
  let [errorMessage, setErrorMessage] = React.useState("");

  function error(message){
    setErrorMessage( <FormErrorMessage msg={message}/> )
  }

  async function validateData(){
    if(name.length < 2){
      error(t('class name too short'));
    }else if(name.length > 25){
      error(t('class name too long'));
    }else{
      callApi({
        name: name
      });
    }
  }

  async function previous(){
    callApi({
      previousScreen: true
    });
  }

  async function callApi(data){
    setLoading(true);
    let response = false;
    response = await props.sendApiData(data);
    if(response == 'die'){
      console.log('died')
      return 0;
    }
    setLoading(false);
    console.log('received data: ', response);
    if(response.error){
      error(t(response.error));
    }
  }

  let button = loading?
  (
    <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
  ) : (
  <>
  <button className="btn"
  onClick={previous}
  aria-label={t("registration previous")}
  >{t("registration previous")}</button>
  <button className="btn"
  onClick={validateData}
  aria-label={t("registration next")}
  >{t("registration next")}</button>
  </>
  )
  return (
  <>
    <header></header>
    <div className="register-container">
      <div className="top-header">
        <h2>{t('class registration title')}</h2>
        <p>{t('class registration info')}</p>
      </div>
      <div className = "scalable">

        {errorMessage}

        <FormInput 
        maxLength={25}
        onChange={e=>setName(e.target.value)}
        label={t("class name")}
        />

        {button}

      </div>
    </div>
  </>
  );
}

export default ClassForm;

