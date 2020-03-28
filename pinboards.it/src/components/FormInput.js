import React from 'react';

const buildHandleEnterKeyPress = (onClick) => ({ key }) => {
  if (key === 'Enter') { 
    if(onClick) onClick(); 
  }
};
// props:
//   onChange
//   type - default text
//   label
//   centered - default true
function FormInput({onEnter, type, centered, ...props}){
  let rndID = "a11y-" + Math.floor(Math.random()*10)
  let isCentered = centered === false ? "" : "centered";
  return(
    <div className={"input-group " + isCentered}>
      <input id={rndID}
      aria-labelledby={"#"+rndID}
      type={type || "text"}
      onKeyPress={ buildHandleEnterKeyPress(onEnter) }
      {...props}
      required/>
      <span className="bar"></span>
      <label htmlFor={rndID}>{props.label || props.type || ""}</label>
    </div>
  )
}

export default FormInput;
