
import React from 'react';
import PropTypes from 'prop-types';


// https://dev.to/johnlukeg/make-react-navigation-accessible-again
const buildHandleEnterKeyPress = (onClick) => ({ key }) => {
  if (key === 'Enter') { 
    if(onClick) onClick(); 
  }
};

const Button = ({ children, onClick, className, ...props }) => {
  let cls = `div-button ${className?className:''}`;
  return(
    <div 
      onClick={ onClick }
      role={ 'button' }
      onKeyPress={ buildHandleEnterKeyPress(onClick) }
      tabIndex={ 0 }
      className={cls}
      {...props}
    >
      { children }
    </div>
  );
}

export default Button;
