import React from 'react';
import colors from '../utils/colors';
import plannerContext from '../contexts/plannerContext.js';


function EventCardRow(props){
  let participants = ""
  return (
    <div>
      <div className="date"><h4>4/11</h4></div>
      <div className="participants">
        {participants}
        <div>
          giorgio vasari
          <i className="material-icons"> close </i>
        </div>
        <div>
          mario vasari
          <i className="material-icons"> close </i>
        </div>
        <div><i className="material-icons"> add_circle</i></div>
      </div>
    </div>
  );
}

function EventCard(props){
  const {data, loading, update, current, updateCurrent} = React.useContext(plannerContext);
  const eventData = data.events[props.eventIndex]
  const solidBaseColor = eventData.baseColor;
  const lightBaseColor = colors.RGB.linearShade(0.6, solidBaseColor)

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
  return(
      <div className="card event"
        style={{backgroundColor: lightBaseColor}}
      >
        <div className="top-bar"
          style={{backgroundColor: solidBaseColor}}
        >
          <h2>{ eventData.name }</h2>
          <button aria-label={"close event card"}
          title={"close event card"}
          onClick={()=>updateCurrent(undefined)}
          ><i className="material-icons">close</i></button>
        </div>
        <div className="calendar">
          {dates}
          <div>
            <div className="date">
              <i className="material-icons"> add_circle </i>
            </div>
          </div>

        </div>
      </div>
  );
}


export default EventCard;
