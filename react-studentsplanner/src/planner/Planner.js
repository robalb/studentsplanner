import React from 'react';
//common imports
import Header from '../components/Header.js';
import LoadingBar from '../components/LoadingBar.js'
//page specific imports
import EventsListCard from './EventsListCard/EventsListCard';
import EventCard from './EventCard/EventCard.js';
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
      //if true, the app stays on hold, avoiding any logic involving plannerData, 
      //and displaying placeholders
      plannerDataLoading: true,
      //if true, the loading bar on top is displayed
      plannerDataUpdating: false,
      plannerData: {},
      //the index of the currently selected event. all the events are in an array in plannerData
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

  sortDatesArray(objA, objB){
    let params = ['year','month','day']
    for(let param of params){
      let a = objA[param]
      let b = objB[param]
      if (a > b) return 1;
      if (b > a) return -1;
    }
    return 0;
  }

  //in a functional component, this would have been a beautiful useReducer
  async updatePlannerData(operation, newData){
    console.log("dataupdate", operation, newData);
    //TODO:
    //spawn a small, unintrusive loading bar on top of the page
    //make api call to apiresolver>updateData
    //on success, update state.plannerData (and therefore the connected plannerdata context)
    //on fail, handle fail
    //remove loading bar
    switch(operation){
      case 'newEvent':
        newData.dates.sort(this.sortDatesArray)
        this.setState({
           plannerDataUpdating: true,
          plannerData: {
            ...this.state.plannerData,
            events: [...this.state.plannerData.events, newData]
          }
        })
        const response1 = await getApiData('simulateOk')
        this.setState({
           plannerDataUpdating: false
        })
        break;

      case 'updateEventDates':
        let newEvents = this.state.plannerData.events;
        newEvents[newData.eventIndex].dates = newData.dates.sort(this.sortDatesArray)
        this.setState({
           plannerDataUpdating: true,
          plannerData: {
            ...this.state.plannerData,
            events: newEvents
          }
        })
        const response2 = await getApiData('simulateOk')
        this.setState({
           plannerDataUpdating: false
        })
        break;
      case 'updateDateStudents':
        //TODO
        break;
      case 'deleteEvent':
        //TODO
        break;
    }
  }

  updateCurrentEvent(newCurrentEventIndex){
    //TODO: allow multiple events if not on mobile
    if(this.state.currentEvent !== newCurrentEventIndex){
      this.setState({
        currentEvent: newCurrentEventIndex
      });
    }
  }

  componentDidMount(){
    //TODO: make only one request, or even better, find a way to 
    //have the account data already injected into the page
    this.loadAccountContextData()
    this.loadPlannerContextData()
  }


  render() {
    //TODO:
    //instead of a currentevent prop, store a currentevents prop, and if on
    //desktop display all the events contained
    let currentEvent = null;
    if(this.state.currentEvent>=0){
      currentEvent = <EventCard eventIndex={this.state.currentEvent}/>;
    }

    //TODO: check: is this good? is this way of creating a new obj also creating mem leaks?
    let plannerContextValues = {
      data: this.state.plannerData,
      loading: this.state.plannerDataLoading,
      update: this.updatePlannerData.bind(this),
      current: this.state.currentEvent,
      updateCurrent: this.updateCurrentEvent.bind(this)
    }
    return (
      <accountContext.Provider value={{data: this.state.accountData, loading: this.state.accountDataLoading}}>
      <plannerContext.Provider value={plannerContextValues}>
        <LoadingBar active={this.state.plannerDataUpdating}/>
        <Header/>
        <div className="content">
          <EventsListCard/>
          {currentEvent}
        </div>
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
