import React from 'react';
import t from '../../../utils/i18n.js';

function NotInClassPanel({data, ...props}){
  return(
    <>
    <h3>{t('not in a class title')}</h3>
    <p>{t('not in a class text')}</p>
    </>
  );
}

export default NotInClassPanel;
