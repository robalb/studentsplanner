import React from 'react';
import t from '../../utils/i18n.js';
import Button from '../../components/Button.js';
import FormInput from '../../components/FormInput.js';
import Collapsible from '../../components/Collapsible.js';
import accountContext from '../../contexts/accountContext.js';

function ClassPanel(props){
  let {data, loading} = React.useContext(accountContext);
  let [show, setShow] = React.useState(true);

  let [clsName, setClsName] = React.useState(
    loading ? '' : data.classroomName
  );

  let content = <p>loading..</p>
  if(!loading){
    let customButton=(
      <div className="custom-button">
        <p>vasaqweqweri</p>
        <p className="admin-tag">[amministratore]</p>
      </div>
    );
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

        <Collapsible
          customButton={customButton}
          maxHeight={300}
          aria-label={t("toggle advanced options")}
          label={t("toggle advanced options")}
          title={t("toggle advanced options")}
        >
          <div className={"content scalable"}>
            <p>Giorgio Vasari</p>
            <p>giorgio@mail.com</p>
            <p> <a href="/">rendi amministratore</a> </p>
            <p> <a href="/">rimuovi</a> </p>
            <FormInput 
            centered={false}
            onBlur = {e=>console.log(e.target.value)}
            onChange={e=>setClsName(e.target.value)}
            aria-label={t("name")}
            label={t("name")}
            title={t("name")}
            type={"text"}
            />
          </div>
        </Collapsible>

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

