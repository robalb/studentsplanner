import React from 'react';
import FormErrorMessage from '../../components/FormErrorMessage.js';
//page specific imports
import './register.css';


function Register(props){
  return(
    <>
    <header></header>
    <div className="register-container">
    <h2> register </h2>
    <h3>username invited you to class_name</h3>
    <p> already have an account? <a href="../account/">login</a> </p>


      <div className="input-group centered">
        <input id="a11y-input2"
        aria-labelledby="#a11y-input2"
        tabIndex="2"
        type="password"
        onChange = {e=>setPassword(e.target.value)}
        required/>
        <span className="bar"></span>
        <label htmlFor="a11y-input2">Password</label>
      </div>

      <div className="input-group centered">
        <input id="a11y-input2"
        aria-labelledby="#a11y-input2"
        tabIndex="2"
        type="password"
        onChange = {e=>setPassword(e.target.value)}
        required/>
        <span className="bar"></span>
        <label htmlFor="a11y-input2">Password</label>
      </div>


    </div>
    </>
  );
}

export default Register;

