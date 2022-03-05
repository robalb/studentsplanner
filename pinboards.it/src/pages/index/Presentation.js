import React from 'react';

import a from './assets/v2_full.png'
import p1 from './assets/preview_1.png'
import p2 from './assets/preview_2.png'
import b1 from './assets/blur_1.png'

export default function Presentation(props){
    return(
        <>
            <header>
                <a href="./register">registrati</a>
                <a className="secondary" href="./account">accedi</a>
            </header>
            <div className="hero">
                <h1>Pinboards</h1>
                <h2>A management platform for highschool students</h2>
                <img className="hero" src={a} />
            </div>

            <div className="preview_1">
                <section>
                    <h1>Pianifica interrogazioni</h1>
                    <p><b>Pianifica i calendari delle interrogazioni </b>
                    assegnando un colore ad ogni materia</p>
                    <p><b>assegna gli studenti ad un giorno.</b> L'app suggerirà 
                    gli studenti più liberi, e colorerà il nome degli studenti impegnati
                    con il colore dell'esame più incombente.  </p>
                    <p><b>Estrai a sorte</b> uno
                    studente tra quelli più liberi da esami, oppure organizza
                    con un click l'intero calendario nella maniera più efficente
                    possibile 
                    grazie al potente algoritmo messo a disposizione dalla piattaforma. </p>
                    
                </section>
                <img src={p1}></img>
            </div>
            <div className="preview_1">
                <img src={p2}></img>
                <section>
                    <h1>crea sondaggi</h1>
                    <p><b>organizza votazioni o sondaggi </b>
                    scegliendo tra un'ampia gamma di formati disponibili.</p>
                    <p><b>Evita doppi voti o brogli; </b> 
                    Solo i membri della classe potranno votare, senza possibilità
                    di ambiguità.
                    </p>
                    <p><b>Sfrutta gli strumenti avanzati </b>
                    di votazione anonima, trasparenza dei voti e molto altro
                    per raggiungere una decisione nella maniera più adatta
                    all'esigenza della classe.
                    </p>
                    
                </section>
            </div>
            <div className="start_now">
                <p>Pinboards è una piattaforma gratuita e completamente open source</p>
                <a href="./register">registrati</a>
                <img src={b1}></img>
            </div>

        </>
    )
}
