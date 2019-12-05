
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

class EventsList extends React.Component{
  constructor(props){
    super(props);
  }

  eventCreatorPopup(){
    //TODO
    //spawn a popup that allows the insertion of all the data.
    //on confirm, the popup will close, and call this callback
    //with data similar to this
    const testEvent = {
      name: "sample event"+Math.floor(Math.random()*999),
      repeatStudents: false,
      baseColor: "#34ace0",
      dates: [
        {
          day: 10,
          month: 11,
          students: []
        },
        {
          day: 13,
          month: 11,
          students: []
        }
      ]
    };
    this.props.handleEventCreated(testEvent)
  }

  render(){
    const badges = this.props.events.map((ev, step)=>{
      return (
        <EventBadge 
          baseColor={ev.baseColor}
          onClick={() => this.props.handleEventClick(step)}
          name={ev.name}
          key={step}
        />
      )
    })
    return (
      <div className="card events-list">
        <div className="top-bar">
          <h2>events</h2>
          <i className="material-icons"> more_vert </i>
        </div>
        <div className="event-badges-container">
          {badges}
          <div className="event-badge-add" onClick={()=>this.eventCreatorPopup()}><i className="material-icons"> add_circle </i></div>
        </div>
      </div>
    );
  }
}

export default EventsList;
