
import '../../index.css';
//function handleEventCreationBtn(){
//  //TODO
//  //spawn a popup that allows the insertion of all the data.
//  //on confirm, the popup will close, and call plannerContext.update

//  //the real popup should do somethig similar to this, but:
//  //choose colors that arent used first, and when they finish create them by mixing existing basecolors
//  let randomColorIndex = Math.floor(Math.random()*colors.colorsList.length)
//  let randomColor = colors.colorsList[randomColorIndex]
//  const testEvent = {
//    name: "sample event"+Math.floor(Math.random()*999),
//    repeatStudents: false,
//    baseColor: randomColor,
//    dates: [
//      {
//        day: 10,
//        month: 11,
//        students: []
//      },
//      {
//        day: 13,
//        month: 11,
//        students: []
//      }
//    ]
//  };
//}

import React from 'react';

function CreationMenu(){
  return (
    <>
      
      <br/>
      <div class="input-group centered">
        <input id="a11y-input1"type="text" required/>
        <span class="bar"></span>
        <label for="a11y-input1">Name</label>
      </div>

      <h3> select a color </h3>

      <div class="color-picker">
        <div class="wrapper">
          <input name="a11y-issues" type="radio" value="1"/>
        </div>

        <div class="wrapper">
          <input name="a11y-issues" type="radio" value="no-focus-styles"/>
        </div>

        <div class="wrapper">
          <input name="a11y-issues" type="radio" value="html-markup"/>
        </div>
      </div>

      <h3> select one or more dates </h3>

      <br/>

    </>
  )
}

export default CreationMenu;
