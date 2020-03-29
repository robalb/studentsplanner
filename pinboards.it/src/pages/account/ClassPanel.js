import React from 'react';
import t from '../../utils/i18n.js';
import Button from '../../components/Button.js';
import FormInput from '../../components/FormInput.js';
import Collapsible from '../../components/Collapsible.js';
import accountContext from '../../contexts/accountContext.js';

function UserRow(props){
  //TODO: use this
  // let form = (
  //   <FormInput 
  //   centered={false}
  //   onBlur = {e=>console.log(e.target.value)}
  //   onChange={e=>console.log(e.target.value)}
  //   aria-label={t("name")}
  //   label={t("name")}
  //   title={t("name")}
  //   type={"text"}
  //   />
  // );

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
      <div className={"content scalable"}>
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
      <span class="material-icons"> group_add </span>
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
      <div className={"content scalable"}>
        <p> <a href="/">rimuovi</a> </p>
      </div>
    </Collapsible>
  );
}

function AddLinkRow(props){
  let customButton=(
    <div className="custom-button-add">
      <span class="material-icons"> insert_link </span>
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
      <div className={"content scalable"}>
        <p> <a href="/">rimuovi</a> </p>
      </div>
    </Collapsible>
  );
}

function ClassPanel(props){
  let {data, loading} = React.useContext(accountContext);
  let [show, setShow] = React.useState(true);

  let [clsName, setClsName] = React.useState(
    loading ? '' : data.classroomName
  );

  let content = <p>loading..</p>
  if(!loading){
    //generate members list
    // let members = ""
    // data.students.map( (student, key) => console.log(student, key))
    let members = data.students.map( (student, key) => <UserRow
      key={key}
      {...student}
      />);

    content = (
    <div className="content">
      <h3>{t('your class title')}</h3>
      <FormInput 
      value = {clsName}
      onBlur = {e=>console.log(e.target.value)}
      onChange={e=>setClsName(e.target.value)}
      type={"text"}
      />

      <div className="members-container">
        <AddMailRow />
        <AddLinkRow />
        {members}
      </div>
    </div>
  );
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
      {show ? content : ''}
    </div>
  );
}

export default ClassPanel;

