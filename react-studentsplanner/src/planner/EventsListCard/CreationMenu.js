
import colors from '../../utils/colors.js';
import plannerContext from '../../contexts/plannerContext.js';

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
  const {data, loading, update} = React.useContext(plannerContext);
  let [selectedColor, selectColor] = React.useState(0)

  if(loading){
    return (<><br/><p>...</p><br/><br/></>)
  }


  let aviableColors = colors.colorsList.slice();
  //removes from this list the colors already in use in data.events[x].baseColor
  aviableColors = aviableColors.filter(color=>{
    let foundMatch = false;
    data.events.forEach(ev=>{
      if(ev.baseColor == color){
        foundMatch = true;
      }
    })
    return !foundMatch;
  })


  let colorOptions = aviableColors.map((color, step)=>{
    return(
      <button
        className={(selectedColor==step?'selected':'')}
        onClick={()=>selectColor(step)}
        aria-label={"select this theme color"}
        title={"select this theme color"}
        style={{backgroundColor:color}}
        key={step}
      />
    );
  })

  return (
    <>
      
      <div className="input-group centered">
        <input id="a11y-input1" aria-labelledby="a11y-input1" type="text" required/>
        <span className="bar"></span>
        <label htmlFor="a11y-input1">Name</label>
      </div>

      <div className="color-picker">
        {colorOptions}
      </div>

      <h3> select one or more date</h3>
      <br/>

    </>
  )
}

export default CreationMenu;
