import React from 'react';
//common imports
import Header from '../Header';
//page specific imports
import EventsList from './EventsList';
import testData from './testData'
import './planner.css';

class Planner extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      ...testData,
      currentEvent: undefined
    };
  }

  handleEventClick(e){
    //TODO: allow multiple events if not on mobile
    this.setState({
      currentEvent: e
    });
  }

  handleEventCreated(e){
    //TODO
    //start data sync process

    this.setState({
      events: this.state.events.concat([e])
    })

  }

  render() {
    //TODO:
    //instead of a currentevent prop, store a currentevents prop, and if on
    //desktop display all the events contained
    let eventToDisplay;
    let currentEvent = this.state.currentEvent
    if(currentEvent>=0){
      eventToDisplay = <p>current event: {this.state.events[currentEvent].name}</p>
    }

    return (
      <div>
        <Header classroomName="5M" name="alberto ventafridda" isAdmin={false} />
        <div className="content">
          <EventsList 
            events={this.state.events}
            handleEventClick={e=>this.handleEventClick(e)}
            handleEventCreated={e=>this.handleEventCreated(e)}
            />
            {eventToDisplay}
        </div>
      </div>
    );
  }
}

export default Planner;
