import React from 'react';
import t from '../../utils/i18n.js';
import Button from '../../components/Button.js';
import FormInput from '../../components/FormInput.js';
import accountContext from '../../contexts/accountContext.js';

function ClassPanel(props){
  let {data, loading} = React.useContext(accountContext);
  let [show, setShow] = React.useState(true);

  let [clsName, setClsName] = React.useState(
    loading ? '' : data.classroomName
  );

  let content = loading? (
    <p>loading..</p>
  ) : (
    <div className="content">
      <h3>{t('your class title')}</h3>
      <FormInput 
      value = {clsName}
      onBlur = {e=>console.log(e.target.value)}
      onChange={e=>setClsName(e.target.value)}
      type={"text"}
      />
    </div>
  );
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

