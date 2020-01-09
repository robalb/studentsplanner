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

  //in a functional component, this would have been a beautiful useReducer
  async updatePlannerData(newData, operation){
    console.log("dataupdate");
    //TODO:
    //spawn a small, unintrusive loading bar on top of the page
    //make api call to apiresolver>updateData
    //on success, update state.plannerData (and therefore the connected plannerdata context)
    //on fail, handle fail
    //remove loading bar
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
