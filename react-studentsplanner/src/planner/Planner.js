import React from 'react';
//common imports
import Header from '../components/Header.js';
//page specific imports
import EventsListCard from './EventsListCard/EventsListCard';
import EventCard from './EventCard';
import './planner.css';
//context imports
import accountContext from '../contexts/accountContext.js';
import plannerContext from '../contexts/plannerContext.js';
import {getApiData, updateData} from '../utils/apiResolver.js';

class Planner extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      accountDataLoading: true,
      accountData: {},
      plannerDataLoading: true,
      plannerData: {},
      currentEvent: undefined
    };
  }

  async loadAccountContextData(){
    this.setState({accountDataLoading: true})
    const newData = await getApiData('account')
    this.setState({
      accountDataLoading: false,
      accountData: newData
    })
  }
  async loadPlannerContextData(){
    this.setState({plannerDataLoading: true})
    const newData = await getApiData('planner')
    this.setState({
      plannerDataLoading: false,
      plannerData: newData
    })
  }

  componentDidMount(){
    //TODO: make only one request
    this.loadAccountContextData()
    this.loadPlannerContextData()
  }

  handleEventClick(e){
    //TODO: allow multiple events if not on mobile

    if(this.state.currentEvent !== e){
      this.setState({
        currentEvent: e
      });
    }
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
    let currentEvent = null;
    let currentEventIndex = this.state.currentEvent
    if(currentEventIndex>=0){
      currentEvent = (
        <EventCard
          eventData={this.state.events[currentEventIndex]}
        />
      );
    }

    return (
      <accountContext.Provider value={{data: this.state.accountData, loading: this.state.accountDataLoading}}>
      <plannerContext.Provider>
      <>
        <Header/>
      </>
      </plannerContext.Provider>
      </accountContext.Provider>
    );
  }
}

        // <div className="content">
        //   <EventsListCard 
        //     events={this.state.events}
        //     handleEventClick={e=>this.handleEventClick(e)}
        //     handleEventCreated={e=>this.handleEventCreated(e)}
        //   />

        //   {currentEvent}
        // </div>
export default Planner;
