import React from 'react';
//common imports
import Header from '../../components/Header.js';
import LoadingBar from '../../components/LoadingBar.js'
import AuthModal from '../../components/AuthModal.js'
//page specific imports
import EventsListCard from './EventsListCard/EventsListCard.js';
import EventCard from './EventCard/EventCard.js';
import './planner.css';
//context imports
import accountContext from '../../contexts/accountContext.js';
import plannerContext from '../../contexts/plannerContext.js';
import {apiRequest} from '../../utils/apiResolver.js';

import plannerDataReducers from './plannerDataReducers.js';

//initial state handler
function getInitialState(){
  let initialState = {
    //if false, the login component is rendered, and part of the app logic is not executed
    logged: false,
    //if true, the app avoids any logic involving accountData, or displays placeholders
    accountDataLoading: true,
    accountData: {},
    //if true, the app avoids any logic involving plannerData, or displays placeholders
    plannerDataLoading: true,
    plannerData: {},
    //when true, the current plannerData is being sent to the server apis
    plannerDataUpdating: false,
    //the index of the currently selected event. all the events are in an array in plannerData
    currentEvent: undefined
  };
  //update the initialState, based on the data received from php
  if(window.PHP_GLOBALS){
    let logged = PHP_GLOBALS.logged;
    initialState = {
      ...initialState,
      logged: logged,
      accountDataLoading: !logged,
      accountData: !logged || PHP_GLOBALS.data.account,
      plannerDataLoading: !logged,
      plannerData: !logged || PHP_GLOBALS.data.planner
    };
  }
  return initialState;
}


function Planner(props){
  let [state, setState] = React.useState(getInitialState());

  let [pushManager, setPushManager] = React.useState({
    timer: false,
    data: false,
    func: pushData,
    time: 3000
  });

  React.useEffect(()=>{
    //TODO: initialize updates poller if logged (maybe even if not, to check logged status)
    return function cleanup(){
      //TODO: remove updates poller
      clearTimeout(pushManager.timer);
    }
  }, []);

  function updateCurrentEvent(newCurrentEventIndex){
    //TODO: allow multiple events if not on mobile
    //if the received index is not new, abort the operation
    if(state.currentEvent == newCurrentEventIndex) return false;
    setState( state => ({
      ...state,
      currentEvent: newCurrentEventIndex
    }));
  }

  async function pushData(){
    console.log("pushing")
    //perform api call. since it depends on data inside pushManager,
    //it has to be performed from within an update function of setPushManager
    setPushManager(current => {
      console.log("pushing from setPushManager", current)
      //perform api call
      async function asyncPush(){
        let data = {
          action: 'push',
          data: current.data
        };
        let response = await apiRequest('planner', data, 'POST');
        console.log("pushing from setPushManager done!")
        //update the state based on the response.
        setState( state => ({
          ...state,
          plannerDataUpdating: false
        }));
      }
      asyncPush();
      //update the pushManager state
      let newData = {timer: false};
      return { ...current, ...newData }
    });
  }

  function updatePlannerData(operation, newData){
    console.log("dataupdate", operation, newData);
    //update the state using the newdata, and the old data passed through custom reducers
    setState( state => {
      let newState = {
        ...state,
        plannerDataUpdating: true,
        plannerData: plannerDataReducers[operation](state.plannerData, newData)
      }
      //update the push manager, passing the new state data
      setPushManager(current => {
        console.log('setting push manager', current)
        let newData = { data: newState.plannerData};
        //if not set, create the timer
        if(!current.timer){
          newData.timer = setTimeout(current.func, current.time);
        }
        return { ...current, ...newData }
      });
      return newState;
    });
  }

  function handleAuthModal(response){
    //TODO: start short polling timer
    setState(state =>({
      ...state,
      logged: true,
      accountDataLoading: false,
      accountData: response.data.account,
      plannerDataLoading: false,
      plannerData: response.data.planner
    }));
    console.log(response)
  }

  //render related code

  //TODO: instead of a currentevent prop, store a currentevents prop, and if on desktop display all the events contained
  let currentEvent = null;
  if(state.currentEvent>=0){
    currentEvent = <EventCard eventIndex={state.currentEvent}/>;
  }
  //TODO: check: is this good?
  let plannerContextValues = {
    data: state.plannerData,
    loading: state.plannerDataLoading,
    update: updatePlannerData,
    current: state.currentEvent,
    updateCurrent: updateCurrentEvent
  }
  return(
    <accountContext.Provider value={{data: state.accountData, loading: state.accountDataLoading}}>
    <plannerContext.Provider value={plannerContextValues}>
      <LoadingBar active={state.plannerDataUpdating}/>
      <Header currentPage={"planner"}/>
      <div className="content">
        <EventsListCard/>
        {currentEvent}
      </div>
      { state.logged? '' : <AuthModal currentPage={"planner"} requireData={['account','planner']} auth={handleAuthModal}/> }
    </plannerContext.Provider>
    </accountContext.Provider>
  );

}


export default Planner;
