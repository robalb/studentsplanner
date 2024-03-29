import React from 'react';

import lpse from  '../../../utils/lpse.js';
import t from '../../../utils/i18n.js';
import { sha256 } from '../../../utils/crypto.js';
import FormErrorMessage from '../../../components/FormErrorMessage.js';
import FormInput from '../../../components/FormInput.js';
import FormPasswordInfo from '../FormPasswordInfo.js';

function UserForm(props){
  let inviteData = props.data.invited ? props.data.inviteData : {};
  let [errorMessage, setErrorMessage] = React.useState("");
  let [passwordState, setPasswordState] = React.useState(false);
  let [audit, setAudit] = React.useState({score: 0});
  let [loading, setLoading] = React.useState(false);

  let formReducer = (state, action)=>{
    if(action.password){
      let password = action.password || " ";
      validatePassword(password);
    }
    return ({...state, ...action});
  }
  let [form, dispatchForm] = React.useReducer(formReducer, {
    mail: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: ""
  });

  function error(message){
    setErrorMessage( <FormErrorMessage msg={message}/> )
  }

  async function validatePassword(password){
    let options = {
      timeout: 3000,
      breaches: true
    };
    let audit = await lpse(password, options)
    setAudit(audit);
    setPasswordState(
      <FormPasswordInfo audit={audit}/>
    );
  }

  async function validateForm(){
    let mailRe = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
    if(form.firstName.length < 3 || form.firstName.length >= 100){
      error(t("invalid name"));
    }
    if(form.lastName.length < 3 || form.lastName.length >= 100){
      error(t("invalid last name"));
    }
    else if(! (form.mail.length > 3 && mailRe.test(form.mail))){
      error(t("invalid mail"));
    }
    else if(audit.score < 1){
      error(t( "weak password" ));
    }
    else if(form.password.length >= 200){
      error(t("password too long", {maxLength: 200}))
    }
    else if(form.password !== form.confirmPassword){
      error(t("confirm password wrong"))
    }else{
      if(errorMessage) error("");
      //send data to the register api. If there is no error, call the callback otherwise display it
      tryRegistration();
    }
  }

  async function tryRegistration(){
    setLoading(true);
    let isHash = true;
    let hashedPassword = form.password;
    try{
      hashedPassword = await sha256(form.password);
    } catch(e){
      console.log(e)
      isHash = false
    }
    let response = await props.sendApiData({
      mail: form.mail,
      password: hashedPassword,
      //fullnames are good. the way we generate them here may be improved https://www.w3.org/International/questions/qa-personal-names
      fullName: form.firstName + " " + form.lastName,
      isHash: isHash
    });
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
    <button className="btn"
    onClick={validateForm}
    aria-label={t("registration next")}
    >{t("registration next")}</button>
  )
  return(
  <>
    <header></header>
    <div className="register-container">
    <div className="top-header">
    {
      props.data.invited ?
      <h2>{t("invite notice", {name:inviteData.invitedBy,classroom: inviteData.className})}</h2> :
      <h2>{t("register title")}</h2>
    }
      <p> {t("login link text")} <a href="../account/">{t("login button")}</a> </p>
    </div>

    {errorMessage}

    <div className = "scalable">
      <FormInput 
      onChange={e=>dispatchForm({firstName: e.target.value})} 
      label={t("first name")}
      />

      <FormInput 
      onChange={e=>dispatchForm({lastName: e.target.value})} 
      label={t("last name")}
      />

      <FormInput 
      onChange={e=>dispatchForm({mail: e.target.value})} 
      label={t("mail")}
      type={"mail"}
      />

      {passwordState || ""}

      <FormInput 
      onChange={e=>dispatchForm({password: e.target.value})} 
      label={t("password")}
      type={"password"}
      />

      <FormInput 
      onChange={e=>dispatchForm({confirmPassword: e.target.value})} 
      label={t("confirm password")}
      type={"password"}
      />
    </div>

    {button}

    </div>
  </>
  );
}

export default UserForm;

