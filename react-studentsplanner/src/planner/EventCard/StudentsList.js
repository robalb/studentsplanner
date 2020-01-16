import React from 'react';
import plannerContext from '../../contexts/plannerContext.js';
import accountContext from '../../contexts/accountContext.js';
import Button from '../../components/Button.js';

function StudentsList(props){
  const {data, loading, update, current, updateCurrent} = React.useContext(plannerContext);
  //TODO:
  //show only if props.targetSelection is not false,
  //add close button that  calls props.setSelectMode(false)
  //add styles in planner.css
  // <i className="material-icons"> gps_fixed </i>

  let visible = props.targetSelection ? "visible" : ""
  let classes = `card students-picker-container ${visible}`

  let pickerTitle="", eventData = undefined, eventDates
  if(visible){
    eventData = data.events[props.targetSelection.eventIndex]
    eventDates = eventData.dates[props.targetSelection.dateIndex]
    pickerTitle = eventDates.day +"/" + eventDates.month
  }
  let date = visible? props.targetSelection.dataIndex : ""
  return (
    <div className={classes} >
        <div className="top-bar">
          <button aria-label={"close student picker"}
          title={"close student picker"}
          onClick={()=>props.setSelectMode(false)}
          > <i className="material-icons"> close </i>
          </button>
          <div>
            <button>
            <i className="material-icons"> casino </i>
            </button>
            <button>
            <i className="material-icons"> more_vert </i>
            </button>
          </div>
        </div>
        <h3>student for {pickerTitle}</h3>
        <div className="badges-container">
          <Button>roberto</Button>
          <Button>roberto</Button>
          <Button>roberto</Button>
          <Button>roberto</Button>
        </div>
    </div>
      
  )
}

export default StudentsList;
