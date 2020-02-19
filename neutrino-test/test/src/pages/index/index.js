import React from 'react';
import ReactDOM from 'react-dom';
import '../../styles/sharedStyles.css';

function Index(){
  return <><h1>Index</h1><br/><p>welcome</p></>
}
// import Index from './Index.js';

import cssGlobal from '../../utils/cssFocusHelper.js';

ReactDOM.render(<Index />, document.getElementById('root'));

