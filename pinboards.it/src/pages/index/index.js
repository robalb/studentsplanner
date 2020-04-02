import React from 'react';
import ReactDOM from 'react-dom';
import '../../styles/sharedStyles.css';

function Index(){
  return (
    <>
    <h1>Pinboards</h1><br/>
    <p>homepage</p>
    <p><a href="./account">accedi</a><br/> </p>
    <p> <a href="./register"> registrati </a></p>
      <p>this is project is open source at <a href="https://github.com/robalb/studentsplanner/">github</a> </p>
    </>
  )
}
// import Index from './Index.js';

import cssGlobal from '../../utils/cssFocusHelper.js';

ReactDOM.render(<Index />, document.getElementById('root'));

