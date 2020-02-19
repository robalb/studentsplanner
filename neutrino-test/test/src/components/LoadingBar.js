
import React from 'react';
import PropTypes from 'prop-types';

const LoadingBar = (props)=>{
  let classes = `loading-bar ${props.active?'active':''}`
  return (
    <div className={classes}>
      <ul>
         <li> </li>
         <li> </li>
         <li> </li>
         <li> </li>
         <li> </li>
         <li> </li>
      </ul>
    </div>
  )
}

export default LoadingBar;
