import React from 'react';

function FormErrorMessage(props){
  return props.msg ? (
    <div className="error-message">
    <i className="material-icons">error</i>
    <p>{props.msg}</p>
    </div>
  ) : (
    <div className="error-message disappearing-placeholder">
    <p>loading</p></div>
  );
}

export default FormErrorMessage;
