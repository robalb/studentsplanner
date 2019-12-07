import React from 'react';

function EventBadge(props){
  return(
    <div
    className="event-badge"
    style={{backgroundColor: props.baseColor}}
    onClick={props.onClick}
    >{props.name}</div>
  );
}

function ListView(props){
  const badges = props.events.map((ev, step)=>{
    return (
      <EventBadge 
        baseColor={ev.baseColor}
        onClick={() => props.handleEventClick(step)}
        name={ev.name}
        key={step}
      />
    )
  })
  return(
    <div className="event-badges-container">
      {badges}
      <div className="event-badge-add" onClick={()=>props.handleEventCreationBtn()}><i className="material-icons"> add_circle </i></div>
    </div>
  );
}

export default ListView;
