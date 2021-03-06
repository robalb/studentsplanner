import React from 'react';
import t from '../../../utils/i18n.js';
import copyToClipboard from '../../../utils/copyToClipboard.js';
import Collapsible from '../../../components/Collapsible.js';
import LinkButton from '../../../components/LinkButton.js';

function AddLinkRow(props){
  let inviteUrl = props.inviteCode.inviteUrl + props.inviteCode.inviteCode

  function copyLink(){
    copyToClipboard(inviteUrl);
    //todo: send api request to update the invitedBy row
  }

  function revoke(){
    console.log(1)
    //delete current url in db. create a new one, update the code in the class table
  }

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
        <p><LinkButton onClick={copyLink}>{t('copy link btn')}</LinkButton></p>
        <p><LinkButton onClick={revoke}>{t('revoke link btn')}</LinkButton></p>
      </div>
    </Collapsible>
  );
}

export default AddLinkRow;

