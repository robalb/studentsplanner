
import React from 'react';
import colors from '../../utils/colors.js';
import plannerContext from '../../contexts/plannerContext.js';
import Calendar from '../../components/Calendar.js'
import Button from '../../components/Button.js';

function CreationMenu(props){
  const {data, loading, update} = React.useContext(plannerContext);
  let [selectedColor, selectColor] = React.useState(0)
  let [dates, setDates] = React.useState([])
  let [eventName, setEventName] = React.useState("")

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
  //check if there are colors left
  let limitReached = !aviableColors.length
  //generate the buttons from the aviable colors list
  let colorOptions = aviableColors.map((color, step)=>{
    return(
      <button
        className={(selectedColor==step?'selected':'')}
        onClick={()=>selectColor(step)}
        aria-label={(selectedColor==step? 'unselect' : 'select' ) + " this theme color"}
        title={"select this theme color"}
        style={{backgroundColor:color}}
        key={step}
      />
    );
  })


  let dateObjMatches = (momentObj, day, month, year)=>{
    return(
      (momentObj.date() == day) &&
      (momentObj.month() == month) &&
      (momentObj.year() == year)
    )
  }
  let toggleCellDate = cellDate=>{
    //removes the cellDate from the dates array
    let newDates = dates.filter(current=>{
      return !dateObjMatches(cellDate, current.day, current.month, current.year)
    });
    //if the previous operation didn't remove anything, add the date
    if (newDates.length == dates.length){
      newDates.push({
        day: cellDate.date(),
        month: cellDate.month(),
        year: cellDate.year(),
        students: []
      })
    }
    //update the dates array
    setDates(newDates)
  }

  //the calendar cell component
  let cell = cellDate =>{
    let cellIsSelected = dates.some(current=>{
      return dateObjMatches(cellDate, current.day, current.month, current.year)
    })
    let cellColor = cellIsSelected ? aviableColors[selectedColor] : 'transparent'
    return(
      <Button
      aria-label={(cellIsSelected ? 'deselect' : 'select') + ' day ' + cellDate.format('D')}
      title={cellDate.format('D')}
      onClick={()=>toggleCellDate(cellDate)}
      style={{backgroundColor:cellColor}}
      >
      </Button>
    );
  }

  let eventExist = name=>{
    let nameFound = false
    data.events.forEach(ev=>{
      if(name == ev.name) nameFound = true
    })
    return nameFound
  }

  let handleCreation = ()=>{
    let trimmedEventName = eventName.trim().replace(/ +(?= )/g,'');
    if(dates.length < 1){
      alert("select one or more dates")
    }
    else if(trimmedEventName.length < 1){
      alert("enter a name for the event")
    }
    else if(eventExist(trimmedEventName)){
      alert("this event already exist")
    }
    else{
      update("newEvent", {
        name: trimmedEventName,
        repeatStudents: false,
        baseColor: aviableColors[selectedColor],
        dates: dates
      })
      props.setCreationMode(false)
    }
  }

  return (
    limitReached ? 
    (<>
     <h3>you reached the limit of events for a demo account</h3>
      <div className="btns-container">
        <button className="btn "
        onClick={()=>props.setCreationMode(false)}
        aria-label={"undo event creation"}>ok</button>
      </div>
      <br/>
     </>) :
    (<>
      <div className="input-group centered">
        <input id="a11y-input1"
        aria-labelledby="#a11y-input1"
        value={eventName}
        onChange={e=>setEventName(e.target.value)}
        type="text"
        required/>
        <span className="bar"></span>
        <label htmlFor="a11y-input1">Name</label>
      </div>

      <div className="color-picker">
        {colorOptions}
      </div>

      <h3> select one or more date</h3>
      <div className="calendar-shadow">
      <Calendar
        cell={cell}
      />
      </div>
      <div className="btns-container">
        <button className="btn"
        onClick={handleCreation}
        aria-label={"create event"}
        >create</button>
        <button className="btn close"
        onClick={()=>props.setCreationMode(false)}
        aria-label={"undo event creation"}>close</button>
      </div>
      <br/>

    </>)
  )
}

export default CreationMenu;
