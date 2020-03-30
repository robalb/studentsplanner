import React from 'react';

import t from '../../../utils/i18n.js';
import accountContext from '../../../contexts/accountContext.js';

import NotInClassPanel from './NotInClassPanel.js';
import InClassPanel from './InClassPanel.js';

function ClassPanel(props){
  let {data, inviteCode, loading} = React.useContext(accountContext);

  //placeholder to display wihle the data is loading
  let content = <p>loading..</p>
  //display the view relying on user data
  if(!loading){
    if(data.user.inClassroom){
      //the user is in a classroom
      content = <InClassPanel data={data} inviteCode={inviteCode} />
    }else{
      //the user is not in a classroom
      content = <NotInClassPanel data={data} />
    }
  }
  return(
    <div className="card account" id="class">
      <div className="card-content">
        {content}
      </div>
    </div>
  );
}

export default ClassPanel;

