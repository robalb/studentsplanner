import React from 'react';
//common imports
import Header from '../../components/Header.js';
import LoadingBar from '../../components/LoadingBar.js'
//page specific imports
import EventsListCard from './EventsListCard/EventsListCard.js';
import EventCard from './EventCard/EventCard.js';
import './planner.css';
//context imports
import accountContext from '../../contexts/accountContext.js';
import plannerContext from '../../contexts/plannerContext.js';
import {getApiData, updateData} from '../../utils/apiResolver.js';

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

  //look at this. Isn't it beautiful?
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
    //TODO: setState is asyncronous. check if setting a new state based on the old state like this
    //is a good idea cause it looks like a good source for hidden racing conditons
    //TODO: handle connection errors. this should probably be done in the getApidata script
    //TODO: optimize this code: put the switch only in the logic behind the newEvents varaible. the rest is the same in every switch case
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
        let newEvents = this.state.plannerData.events.slice();
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
        let newEvents2 = this.state.plannerData.events.slice(0);
        newEvents2[newData.eventIndex].dates[newData.dateIndex].students = newData.students
        this.setState({
           plannerDataUpdating: true,
          plannerData: {
            ...this.state.plannerData,
            events: newEvents2
          }
        })
        const response3 = await getApiData('simulateOk')
        this.setState({
           plannerDataUpdating: false
        })
        break;
      case 'deleteEvent':
        //TODO
        break;
    }
  }

  updateCurrentEvent(newCurrentEventIndex){
    //TODO: allow multiple events if not on mobile [same as the issue described in line 123]
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
    //desktop display all the events contained [same issue as the one described on line 106]
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
