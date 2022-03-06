import React from 'react';

import t from '../../utils/i18n.js';

import a from './assets/v2_full.png'
import p1 from './assets/preview_1.png'
import p2 from './assets/preview_2.png'
import b1 from './assets/decor_11.png'

export default function Presentation(props){
    return(
        <>
            <header>
                <a href="./register">{t('pres_register')}</a>
                <a className="secondary" href="./account">{t('pres_join')}</a>
            </header>
            <div className="hero">
                <h1>{t('pres_title')}</h1>
                <h2>{t('pres_description')}</h2>
                <img className="hero" src={a} alt="" role="presentation"/>
            </div>

            <div className="preview p1">
                <section>
                    <h1>{t('pres_preview_1_title')}</h1>
                    <p><b>{t('pres_preview_1a_bold')}</b>
                    {t('pres_preview_1a')}</p>
                    <p><b>{t('pres_preview_1b_bold')}</b>{t('pres_preview_1b')}</p>
                    <p><b>{t('pres_preview_1c_bold')}</b>{t('pres_preview_1c')}</p>
                    
                </section>
                <img src={p1} alt="screenshot del calendario di un esame"></img>
            </div>
            <div className="preview p2">
                <img src={p2} alt="screenshot di un sondaggio in corso"></img>
                <section>
                    <h1>{t('pres_preview_2_title')}</h1>
                    <p><b>{t('pres_preview_2a_bold')}</b>
                    {t('pres_preview_2a')}</p>
                    <p><b>{t('pres_preview_2b_bold')}</b> 
                    {t('pres_preview_2b')}</p>
                    <p><b>{t('pres_preview_2c_bold')}</b>
                    {t('pres_preview_2c')}</p>
                    
                </section>
            </div>
            <div className="start_now">
                <a href="./register" className="btn">{t('pres_register')}</a>
                <section>
                    <h2>{t('pres_call_to_action_top')}<br></br>{t('pres_call_to_action_bottom')}</h2>
                    <p>{t('pres_footer_top')}<br/>{t('pres_footer_bottom')}
                    <a href="https://github.com/robalb/studentsplanner">github</a>
                        <br/>
                        <br/>
                    Made with <span>&#9829;</span> in Milan </p>
                </section>
                <img src={b1} alt="" role="presentation"></img>
            </div>

        </>
    )
}
