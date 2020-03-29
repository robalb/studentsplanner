import React from 'react';
import t from '../../utils/i18n.js';
import Button from '../../components/Button.js';
import FormInput from '../../components/FormInput.js';
import Collapsible from '../../components/Collapsible.js';
import accountContext from '../../contexts/accountContext.js';

function UserRow(props){
  let isAdmin = props.isAdmin;
  let customButton=(
    <div className="custom-button">
      <p>{props.uid}</p>
      { isAdmin ?  <p className="admin-tag">[amministratore]</p> : "" }
    </div>
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
        <p>giorgio@mail.com</p>
        { !isAdmin ?  <p> <a href="/">rendi amministratore</a> </p> : '' }
        <p> <a href="/">rimuovi</a> </p>
      </div>
    </Collapsible>
  );
}

function AddMailRow(props){
  let customButton=(
    <div className="custom-button-add">
      <span className="material-icons"> group_add </span>
      <h4>{t("add member")}</h4>
    </div>
  );
  return (
    <Collapsible
      customButton={customButton}
      maxHeight={300}
      aria-label={t("add member")}
      label={t("add member")}
      title={t("add member")}
    >
      <div className={"collapse-content scalable"}>
        <p>{t("invite via mail description")}</p>
        <FormInput 
        centered={false}
        onBlur = {e=>console.log(e.target.value)}
        onChange={e=>console.log(e.target.value)}
        aria-label={t("mail")}
        label={t("mail")}
        title={t("mail")}
        type={"mail"}
        />
        <div className="btns-container">
          <button className="btn"
          aria-label={"invite btn"}
          >{t("invite btn")}</button>
        </div>
      </div>
    </Collapsible>
  );
}

function AddLinkRow(props){
  let inviteUrl = props.inviteCode.inviteUrl + props.inviteCode.inviteCode
  let customButton=(
    <div className="custom-button-add">
      <span className="material-icons"> insert_link </span>
      <h4>{t("add member link")}</h4>
    </div>
  );
  return (
    <Collapsible
      customButton={customButton}
      maxHeight={300}
      aria-label={t("add member link")}
      label={t("add member link")}
      title={t("add member link")}
    >
      <div className={"collapse-content scalable"}>
        <p>{t("invite via link description")}</p>
        <div className="link-container">
          <p>{inviteUrl}</p>
        </div>
        <p><a href="#">copia link</a></p>
        <p><a href="#">revoca link</a></p>
      </div>
    </Collapsible>
  );
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

  //renders the students list
  let members = data.students
    .slice()
    .sort(sortStudents)
    .map( (student, key) => <UserRow key={key} {...student} />);
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
function NotInClassPanel({data, ...props}){
  return(
    <>
    <h3>{t('not in a class title')}</h3>
    <p>{t('not in a class text')}</p>
    </>
  );
}

function ClassPanel(props){
  let {data, inviteCode, loading} = React.useContext(accountContext);
  let [show, setShow] = React.useState(true);

  console.log(data)

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
    <div className="card account">
      <Button 
      className="top-bar"
      onClick={()=>setShow(!show)}
      >
        <h2>{t("class settings title")}</h2>
        <i className="material-icons">{show? 'keyboard_arrow_up' : 'keyboard_arrow_down' }</i>
      </Button>
      <div className="collapse-content">
        {show ? content : ''}
      </div>
    </div>
  );
}

export default ClassPanel;

