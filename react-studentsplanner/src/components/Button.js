
import React from 'react';
import PropTypes from 'prop-types';

//this is a cmponent for improving accessibility on legacy code
//that uses div as buttons. simply replace <div> with <Button> to use it,
//and use real buttons wenewher possible in new code
//the styles for this element are in the global file index.css
// https://dev.to/johnlukeg/make-react-navigation-accessible-again
const buildHandleEnterKeyPress = (onClick) => ({ key }) => {
  if (key === 'Enter') { 
    if(onClick) onClick(); 
  }
};

const Button = ({ children, onClick, className='', ...props }) => {
  let cls = `div-button ${className}`;
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
