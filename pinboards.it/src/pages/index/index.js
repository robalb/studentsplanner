/*
 * the index page is in plain html and css, no React
 */
import React from 'react';
import ReactDOM from 'react-dom';
import Presentation from './Presentation.js';

import './index.css';
import cssGlobal from '../../utils/cssFocusHelper.js';


ReactDOM.render(<Presentation />, document.getElementById('root'));



