import React from 'react';
import t from '../../utils/i18n.js';
import FormErrorMessage from '../../components/FormErrorMessage.js';
import FormInput from '../../components/FormInput.js';
//page specific imports
import './register.css';


function Register(props){
  //todo: get this data from global variables
  let [invited, setInvited] = React.useState(false);
  let [inviteData, setInvitedata] = React.useState({});

  React.useEffect( ()=>{
    let invited = PHP_GLOBALS.invited;
    if(invited){
      setInvited(invited);
      setInvitedata(PHP_GLOBALS.inviteData);
    }
  })


  let pageTitle = invited ?
    ( <h2>{t("register invite notice", {name:inviteData.invitedBy,classroom: inviteData.className})}</h2>) :
    ( <h2>{t("register title")}</h2>);

  return(
  <>
    <header></header>
    <div className="register-container">
      {pageTitle}
      <p> {t("login link text")} <a href="../account/">{t("login button")}</a> </p>


      <FormInput 
      onChange={e=>console.log(e.target.value)} 
      label={t("full name")}
      />

      <FormInput 
      onChange={e=>console.log(e.target.value)} 
      label={t("mail")}
      type={"mail"}
      />

      <FormInput 
      onChange={e=>console.log(e.target.value)} 
      label={t("password")}
      type={"password"}
      />

      <FormInput 
      onChange={e=>console.log(e.target.value)} 
      label={t("confirm password")}
      type={"password"}
      />

      <button className="btn"
      aria-label={t("registration next")}
      >{t("registration next")}</button>

    </div>
  </>
  );
}

export default Register;

