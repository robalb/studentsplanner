import React from 'react';
import Calendar from '../../../components/Calendar.js'
import plannerContext from '../../../contexts/plannerContext.js';
import Button from '../../../components/Button.js';

import t from '../../../utils/i18n.js';

function EditMenu(props){
  const {data, loading, update, current, updateCurrent} = React.useContext(plannerContext);
  const eventData = data.events[props.eventIndex]
  const solidBaseColor = eventData.baseColor;
  let [dates, setDates] = React.useState(eventData.dates)

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
    let cellColor = cellIsSelected ? eventData.baseColor : 'transparent'
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


  let handleCreation = ()=>{
    if(dates.length < 1){
      alert("select at least one date")
    }
    else{
      update("updateEventDates", {
        eventIndex: props.eventIndex,
        dates: dates
      })
      props.setEditMode(false)
    }
  }

  return (
    <div className="edit-card-container">
    <h3>{t("edit dates")}</h3>
    <div className="calendar-shadow">
      <Calendar currentMonth={dates.length>0 ? dates[0].month : undefined} cell={cell}/>
    </div>
    <div className="btns-container">
      <button className="btn"
      aria-label={"save changes"}
      onClick={handleCreation}
      >{t("close and save")}</button>
    </div>
    <br/>
    </div>
  );

}

export default EditMenu;
