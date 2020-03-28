import React from 'react';
import t from '../../utils/i18n.js';
import Button from '../../components/Button.js';

function AccountPanel(props){
  let [show, setShow] = React.useState(true);
  let content = (
    <p>content</p>
  );
  return(
      <div className="card account">
        <Button 
        className="top-bar"
        onClick={()=>setShow(!show)}
        >
          <h2>{t("account settings title")}</h2>
          <i className="material-icons">{show? 'keyboard_arrow_up' : 'keyboard_arrow_down' }</i>
        </Button>
        {show ? content : ''}
      </div>
  );
}

export default AccountPanel;


