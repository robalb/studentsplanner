import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Planner from './planner/Planner.js';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Planner />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// https://stackoverflow.com/questions/31933359/using-react-in-a-multi-page-app
