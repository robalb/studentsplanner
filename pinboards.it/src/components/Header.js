import React from 'react';
// TODO: implement svg loaders
// import logo from '../assets/logo.svg';
import accountContext from '../contexts/accountContext.js';
import PlaceHolder from './PlaceHolder.js';

import Button from './Button.js';
import t from '../utils/i18n.js';

function Header(props){
  let {data, loading} = React.useContext(accountContext);
  let pages = [ 'account', 'planner', 'polls' ];
  let currentPage = props.currentPage ?? pages[0];
  let list = pages.filter(page => page != currentPage).map( page => <a href={'../' + page}>{t(page)}</a> )
  return(
    <header>
    <div className="menu-container">
      <div className="burger">
        <a href="#" aria-haspopup="true">{t(currentPage)}</a>
        <span class="material-icons"> arrow_drop_down </span>
      </div>
      <div className="menu" aria-label="submenu">
        {list}
      </div>
    </div>

      <div className="class-info"> 
        <PlaceHolder ready={!loading}>
          <h2 className="name">{data.classroomName}</h2>
       </PlaceHolder>
      </div>

      <Button className="user">
        <PlaceHolder ready={!loading}>
          <p className="name">{!loading && data.user.uid}</p>
        </PlaceHolder>
        <i className="material-icons"> account_circle </i>
      </Button>
    </header>
  );
}

export default Header;
