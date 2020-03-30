import React from 'react';
import t from '../../utils/i18n.js';
import Button from '../../components/Button.js';

function AccountPanel(props){
  let content = ( <p>loading..</p>);

        // <div className="top-bar">
        //   <Button 
        //   className = "left"
        //   onClick={e => window.location.replace("#class")}
        //   >
        //     <h2>{t("class settings title")}</h2>
        //   </Button>
        //   <Button 
        //   className = "right"
        //   onClick={e => window.location.replace("#account")}>
        //   >
          // <h2>{t("class settings title")}</h2>
        //     <h2>{t("account settings title")}</h2>
        //   </Button>
        // </div>
  return(
      <div className="card account" id="account">
        <div className="card-content">
          {content}
        </div>
      </div>
  );
}

export default AccountPanel;


