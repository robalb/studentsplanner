
import React from 'react';
import colors from '../../utils/colors.js';
import plannerContext from '../../contexts/plannerContext.js';
import Calendar from '../../components/Calendar'
import Button from '../../components/Button.js';

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


function CreationMenu(){
  const {data, loading, update} = React.useContext(plannerContext);
  let [selectedColor, selectColor] = React.useState(0)
  let [dates, setDates] = React.useState([])

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
  //generate the buttons from the aviable colors list
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


  let toggleCellDate = cellDate=>{
    //removes the cellDate from the dates array
    let newDates = dates.filter(current=>{
      return !(current.day == cellDate.date() && current.month == cellDate.month())
    });
    //if the previous operation didn't remove anything, add the date
    if (newDates.length == dates.length){
      newDates.push({
        day: cellDate.date(),
        month: cellDate.month(),
        students: []
      })
    }
    //update the dates array
    setDates(newDates)
  }

  //the calendar cell component
  let cell = (date)=>{
    let cellIsSelected = dates.some(current=>{
      return (current.day == date.date() && current.month == date.month())
    })
    let cellColor = cellIsSelected ? aviableColors[selectedColor] : 'transparent'
    return(
      <Button
      aria-label={(cellIsSelected ? 'deselect' : 'select') + ' day ' + date.format('D')}
      title={date.format('D')}
      onClick={()=>toggleCellDate(date)}
      style={{backgroundColor:cellColor}}
      className="creation-calendar-cell" >
      </Button>
    );
  }

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
      <Calendar
        cell={cell}
      />
      <br/>

    </>
  )
}

export default CreationMenu;
