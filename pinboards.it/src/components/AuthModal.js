import React from 'react';

function ErrorMessageDiv(props){
  return (
    <div className="error-message">
    <i className="material-icons">error</i>
    <p>{props.msg}</p>
    </div>
  );
}

function AuthModal(props){
  let [password, setPassword] = React.useState("");
  let [mail, setMail] = React.useState("");
  let [errorMessage, setErrorMessage] = React.useState("");
  let [loading, setLoading] = React.useState(false);
  //TODO: internal data validation. if valid, call received callback on click.
  let validateForm = ()=>{
    let mailRe = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
    if(! (mail.length > 3 && mailRe.test(mail))){
      setErrorMessage( <ErrorMessageDiv msg="invalid mail" /> )
    }
    else if(password.length < 6){
      setErrorMessage( <ErrorMessageDiv msg="invalid password" /> )
    }
    else{
      setLoading(true)
      setErrorMessage("")
      props.auth(mail, password);
    }
  }

  let button = loading?
  (
    <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
  ) : (
    <button className="btn"
    onClick={validateForm}
    tabindex="3"
    aria-label={"sign in"}
    >sign in</button>
  )
  return(
    <div class="auth-modal-wrapper">
      <div class="auth-modal">
      <h2>please sign in to continue</h2>

      {errorMessage}

      <div className="input-group centered">
        <input id="a11y-input3"
        aria-labelledby="#a11y-input3"
        tabindex="1"
        type="mail"
        onChange = {e=>setMail(e.target.value)}
        required/>
        <span className="bar"></span>
        <label htmlFor="a11y-input3">Mail</label>
      </div>

      <div className="input-group centered">
        <input id="a11y-input2"
        aria-labelledby="#a11y-input2"
        tabindex="2"
        type="password"
        onChange = {e=>setPassword(e.target.value)}
        required/>
        <span className="bar"></span>
        <label htmlFor="a11y-input2">Password</label>
      </div>

      {button}
      
      </div>
    </div>
  );
}

export default AuthModal;
