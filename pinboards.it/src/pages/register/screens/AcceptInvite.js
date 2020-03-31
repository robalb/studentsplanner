import React from 'react';
import t from '../../../utils/i18n.js';
import {apiRequest} from '../../../utils/apiResolver.js';
import FormErrorMessage from '../../../components/FormErrorMessage.js';

function AcceptInvite(props){
  let [loading, setLoading] = React.useState(false);
  let [errorMessage, setErrorMessage] = React.useState("");

  let data = props.data
  console.log(data)

  function error(message){
    setErrorMessage( <FormErrorMessage msg={message}/> )
  }

  async function join(){
    console.log("join");
    let data = {accept:true};
    let response = await apiRequest('register', data, 'POST');
    console.log(response)
  }

  let button = loading?
  (
    <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
  ) : (
    <button className="btn"
    onClick={join}
    tabIndex={3}
    aria-label={t("join class btn")}
    >{t("join class btn")}</button>
  )
  return(
  <>
    <div className="register-container captcha">
      <h2>{t("invite notice", {name:data.invitedBy,classroom: data.className})}</h2>
      <p>{t("accept invite info")}</p>
      <p><a href="../account/">{t("back")}</a></p>
      {button}
    </div>
  </>
  );
}

export default AcceptInvite;

