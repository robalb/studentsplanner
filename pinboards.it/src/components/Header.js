import React from 'react';
// TODO: implement svg loaders
import logo from '../assets/logo.svg';
import accountContext from '../contexts/accountContext.js';
import PlaceHolder from './PlaceHolder.js';

function Header(props){
  let {data, loading} = React.useContext(accountContext);
  return(
    <header>
      <div className="logo">
        <div className="temporary-swg"> 
          <img src={logo} className="App-logo" alt="logo" />
        </div>
      </div>
      <div className="class-info"> 
        <PlaceHolder ready={!loading}>
          <h2 className="name">{data.classroomName}</h2>
       </PlaceHolder>
      </div>
      <div className="user">
        <PlaceHolder ready={!loading}>
          <p className="name">{!loading && data.user.uid}</p>
          {!loading && data.user.isAdmin? <p className="status-badge">admin</p> : ''}
        </PlaceHolder>
        <i className="material-icons"> account_circle </i>
      </div>
    </header>
  );
}

export default Header;
