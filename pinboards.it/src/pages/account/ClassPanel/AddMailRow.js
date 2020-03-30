import React from 'react';
import t from '../../../utils/i18n.js';
import Collapsible from '../../../components/Collapsible.js';
import FormInput from '../../../components/FormInput.js';

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

export default AddMailRow;
