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
      currentEvent: null
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
    return (
      <div>
        <Header classroomName="5M" name="alberto ventafridda" isAdmin={false} />
        <div className="content">
          <EventsList 
            events={this.state.events}
            handleEventClick={e=>this.handleEventClick(e)}
            handleEventCreated={e=>this.handleEventCreated(e)}
            />
          <p>current event: {this.state.currentEvent}</p>
        </div>
      </div>
    );
  }
}

export default Planner;
