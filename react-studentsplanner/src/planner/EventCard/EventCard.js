import React from 'react';
import colors from '../../utils/colors';
import plannerContext from '../../contexts/plannerContext.js';

import EditMenu from './EditMenu.js';


function EventCard(props){
  const {data, loading, update, current, updateCurrent} = React.useContext(plannerContext);
  const eventData = data.events[props.eventIndex]
  const solidBaseColor = eventData.baseColor;
  const lightBaseColor = colors.RGB.linearShade(0.6, solidBaseColor)

  const [editMode, setEditMode] = React.useState(false)

  //closes the edit menu of the current event if a new event is selected
  React.useEffect(()=>{
    setEditMode(false)
  }, [ props.eventIndex ])


  let generateRow = (data, index)=>{
    //TODO: make this international
    let date = data.day +"/"+ (data.month + 1)
    //generate participants tag list
    let participants = ""
    if(data.students.length > 0){
      participants = data.students.map(student=>(
        <div key={student} >
        {student}
        <i className="material-icons"> close </i>
        </div>
      ))
    }
    return (
      <div key={index}>
        <div className="date"><h4>
        {date}
        </h4></div>
        <div className="participants">
          {participants}
          <div><i className="material-icons"> add_circle</i></div>
        </div>
      </div>
    );
  }

  let dates = eventData.dates.map( generateRow )

  let cardContent = editMode ? (
    <EditMenu setEditMode={setEditMode} eventIndex={props.eventIndex}/>
  ) : (
    <div className="calendar">
      {dates}
    </div>
  )
  return(
      <div className="card event"
        style={{backgroundColor: lightBaseColor}}
      >
        <div className="top-bar"
          style={{backgroundColor: solidBaseColor}}
        >
          <h2>{ eventData.name }</h2>
          <div>
          <button aria-label={"edit event"}
          title={"edit event"}
          onClick={()=>setEditMode(!editMode)}
          > <i className="material-icons"> edit </i></button>
          <button aria-label={"close event card"}
          title={"close event card"}
          onClick={()=>updateCurrent(undefined)}
          ><i className="material-icons">close</i></button>
          </div>
        </div>
        {cardContent}
      </div>
  );
}


export default EventCard;
