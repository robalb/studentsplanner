import React from 'react';
import ReactDOM from 'react-dom';
import '../../styles/sharedStyles.css';

function Index(){
  return <><h1>Pinboards</h1><br/><p>homepage</p><a href="./planner">planner</a><br/><p>this is currently a closed demo. <a href="https://github.com/robalb/studentsplanner/issues/new">request a private link</a></p></>
}
// import Index from './Index.js';

import cssGlobal from '../../utils/cssFocusHelper.js';

ReactDOM.render(<Index />, document.getElementById('root'));

