import React from 'react';
import t from '../../../utils/i18n.js';
import FormInput from '../../../components/FormInput.js';
import Collapsible from '../../../components/Collapsible.js';

import AddLinkRow from './AddLinkRow.js';
import AddMailRow from './AddMailRow.js';

function getUserRow(currentUser){
  //return the userRow component, that will have a closure over the current user
  return function UserRow(props){
    let isAdmin = props.isAdmin;
    let customButton=(
      <div className="custom-button">
      <p>{props.uid}</p>
      { isAdmin ?  <p className="admin-tag">{t('user row admin')}</p> : "" }
      </div>
    );
    let adminControls = !currentUser.isAdmin ? '' : (
      <>
      <p>giorgio@mail.com</p>
      { !isAdmin ?  <p> <a href="/">rendi amministratore</a> </p> : '' }
      <p> <a href="/">rimuovi</a> </p>
      </>
    );
    return (
      <Collapsible
      customButton={customButton}
      maxHeight={300}
      aria-label={t("toggle user options")}
      label={t("toggle user options")}
      title={t("toggle user options")}
      >
        <div className={"collapse-content scalable"}>
          <p>{props.fullName}</p>
          {adminControls}
        </div>
      </Collapsible>
    );
  }
}



function sortStudents(objA, objB){
  let a = objA.uid
  let b = objB.uid
  if (a > b) return 1;
  if (b > a) return -1;
  return 0;
}

function InClassPanel({data, ...props}){
  let [clsName, setClsName] = React.useState(data.classroomName);

  //get the user row component that will be used to render the students list
  let GetUserRow = getUserRow(data.user);
  //renders the students list
  let members = data.students
    .slice()
    .sort(sortStudents)
    .map( (student, key) => <GetUserRow key={key} {...student} />);

  //if the list is empty, display a message
  if(data.students.length <1){
    members = <div className="no-members">
      <p>{t(data.user.isAdmin ? 'empty class msg admin' : 'empty class msg')}</p>
    </div>
  }

  //render class panel content
  return(
    <>
    <h3>{t('your class title')}</h3>
    <FormInput 
    value = {clsName}
    onBlur = {e=>console.log(e.target.value)}
    onChange={e=>setClsName(e.target.value)}
    type={"text"}
    />

    <div className="members-container">
      { data.user.isAdmin ?  <> <AddMailRow /> <AddLinkRow inviteCode={props.inviteCode} /> </> : '' }
      {members}
    </div>
    </>
  )

}

export default InClassPanel;
