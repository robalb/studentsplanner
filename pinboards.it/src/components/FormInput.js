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
function FormInput(props){
  let rndID = "a11y-" + Math.floor(Math.random()*10)
  let centered = props.centered === false ? "" : "centered";
  return(
    <div className={"input-group " + centered}>
      <input id={rndID}
      aria-labelledby={"#"+rndID}
      type={props.type || "text"}
      onChange = {e=>props.onChange(e)}
      onKeyPress={ buildHandleEnterKeyPress(props.onEnter) }
      required/>
      <span className="bar"></span>
      <label htmlFor={rndID}>{props.label || props.type || ""}</label>
    </div>
  )
}

export default FormInput;
