import React from 'react';

//the styles for this element are in the global file index.css
// https://dev.to/johnlukeg/make-react-navigation-accessible-again
const buildHandleEnterKeyPress = (onClick) => ({ key }) => {
  if (key === 'Enter') { 
    if(onClick) onClick(); 
  }
};

const LinkButton = ({ children, onClick, ...props }) => {
  // let cls = `link-button ${className}`;
  // className={cls}
  return(
    <a 
      onClick={ onClick }
      role={ 'button' }
      onKeyPress={ buildHandleEnterKeyPress(onClick) }
      tabIndex={ 0 }
      {...props}
    >
      { children }
    </a>
  );
}

export default LinkButton;

