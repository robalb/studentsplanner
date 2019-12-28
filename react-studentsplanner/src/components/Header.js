import React from 'react';
import logo from '../assets/logo.svg';
import accountContext from '../contexts/accountContext.js';
import ReactPlaceholder from 'react-placeholder';
import "react-placeholder/lib/reactPlaceholder.css";

//TODO: move to a HOC, in a separate folder
import {TextRow} from 'react-placeholder/lib/placeholders';
const awesomePlaceholder = (
    <TextRow color='#E0E0E0' style={{margin: 0}}/>
);

function Header(props){
  // let account = React.useContext(accountContext);
  // let isAdmin = !account.loading && account.data.user.isAdmin;
  // let adminTag = isAdmin? <p className="status-badge">admin</p> : '';
  return(
    <accountContext.Consumer>
    {({data, loading})=>(
    <header>
      <div className="logo">
        <div className="temporary-swg"> 
          <img src={logo} className="App-logo" alt="logo" />
        </div>
      </div>
      <div className="class-info"> 
        <ReactPlaceholder ready={!loading} type={"textRow"} customPlaceholder={awesomePlaceholder} firstLaunchOnly={true} showLoadingAnimation={true}>
          <h2 className="name">{data.classroomName}</h2>
       </ReactPlaceholder>
      </div>
      <div className="user">
        <ReactPlaceholder ready={!loading} type={"textRow"} color='#E0E0E0' firstLaunchOnly={true} showLoadingAnimation={true}>
          <p className="name">{!loading && data.user.uid}</p>
          {!loading && data.user.isAdmin? <p className="status-badge">admin</p> : ''}
        </ReactPlaceholder>
        <i className="material-icons"> account_circle </i>
      </div>
    </header>
    )}
    </accountContext.Consumer>
  );
}

export default Header;
