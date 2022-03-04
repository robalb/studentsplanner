import React from 'react';

import a from './assets/v2_full.png'

export default function Presentation(props){
    return(
        <>
        <div className="hero">
        <h1>Pinboards</h1>
        <h2>A highschool management platform for students</h2>
            <img className="hero" src={a} />
        </div>
   <p><a href="./account">accedi</a><br/> </p>
   <p> <a href="./register"> registrati </a></p>
   <p>this is project is open source at <a href="https://github.com/robalb/studentsplanner/">github</a> </p>
   <p>aasd</p>

        </>
    )
}
