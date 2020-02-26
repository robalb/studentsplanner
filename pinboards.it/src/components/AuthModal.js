import React from 'react';

function AuthModal(props){
  //TODO: internal data validation. if valid, call received callback on click.
  return(
    <div class="auth-modal-wrapper">
      <div class="auth-modal">
      <h2>please sign in to continue</h2>

      <div className="input-group centered">
        <input id="a11y-input3"
        aria-labelledby="#a11y-input3"
        type="mail"
        required/>
        <span className="bar"></span>
        <label htmlFor="a11y-input3">Mail</label>
      </div>

      <div className="input-group centered">
        <input id="a11y-input2"
        aria-labelledby="#a11y-input2"
        type="password"
        required/>
        <span className="bar"></span>
        <label htmlFor="a11y-input2">Password</label>
      </div>

        <button className="btn"
        aria-label={"sign in"}
        >sign in</button>
      
      </div>
    </div>
  );
}

export default AuthModal;
