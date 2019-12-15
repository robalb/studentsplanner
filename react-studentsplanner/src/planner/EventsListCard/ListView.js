import React from 'react';

import Button from '../../components/Button.js';

function EventBadge(props){
  return(
    <Button
    className="event-badge"
    style={{backgroundColor: props.baseColor}}
    onClick={props.onClick}
    aria-label={`select event: ${props.name}`}
    >{props.name}</Button>
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
      <Button
      className="event-badge-add"
      onClick={()=>props.handleEventCreationBtn()}><i className="material-icons"> add_circle </i></Button>
    </div>
  );
}

export default ListView;
