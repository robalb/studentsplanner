import React from 'react';
import Button from './Button.js';

function Collapsible({children, buttonTitle, customButton, maxHeight, ...props}){
  let [show, setShow] = React.useState(false);

  let buttonContent = (
    <>
    <i className="material-icons">{show? 'keyboard_arrow_up' : 'keyboard_arrow_down' }</i>
    <p>{buttonTitle ?? ''}</p>
    </>
  );
  if(customButton){
    buttonContent = customButton
  }
  return(
    <div className="collapsible-container">
      <Button 
      onClick={()=>setShow(!show)}
      {...props}
      >
        {buttonContent}
      </Button>
      <div data-maxheight={maxHeight ?? '800'} className={"collapsible " + (show?"":"collapsed")}>
        {children}
      </div>
    </div>
  );
}

export default Collapsible;
