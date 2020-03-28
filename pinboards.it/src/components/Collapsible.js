import React from 'react';
import Button from './Button.js';

function Collapsible({children, buttonTitle, maxHeight, ...props}){
  let [show, setShow] = React.useState(false);
  return(
    <div className="collapsible-container">
      <Button 
      onClick={()=>setShow(!show)}
      {...props}
      >
        <i className="material-icons">{show? 'keyboard_arrow_up' : 'keyboard_arrow_down' }</i>
        <p>{buttonTitle ?? ''}</p>
      </Button>
      <div data-maxheight={maxHeight ?? '800'} className={"collapsible " + (show?"":"collapsed")}>
        {children}
      </div>
    </div>
  );
}

export default Collapsible;
