import React from 'react';
import logo from './logo.svg';

function Header(props){
  let adminTag = props.isAdmin ? <p className="status-badge">admin</p> : '';
  return(
    <header>
      <div className="logo">
        <div className="temporary-swg"> 
          <img src={logo} className="App-logo" alt="logo" />
        </div>
      </div>
      <div className="class-info"> 
       <h2 className="name">{props.classroomName}</h2>
      </div>
      <div className="user">
        <p className="name">{props.name}</p>
        {adminTag}
        <i className="material-icons"> account_circle </i>
      </div>
    </header>
  );
}

export default Header;
