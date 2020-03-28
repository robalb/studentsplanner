import React from 'react';
//common imports
import Header from '../../components/Header.js';
import LoadingBar from '../../components/LoadingBar.js'
import AuthModal from '../../components/AuthModal.js'
//page specific imports
import './account.css';
import AccountPanel from './AccountPanel.js';
import ClassPanel from './ClassPanel.js';
//context imports
import accountContext from '../../contexts/accountContext.js';
import {apiRequest} from '../../utils/apiResolver.js';

//initial state handler
function getInitialState(){
  let initialState = {
    //if false, the login component is rendered, and part of the app logic is not executed
    logged: false,
    //if true, the app avoids any logic involving accountData, or displays placeholders
    accountDataLoading: true,
    accountData: {},
    //updating saved settings
    updatingChanges: false
  };
  //update the initialState, based on the data received from php
  if(window.PHP_GLOBALS){
    let logged = PHP_GLOBALS.logged;
    initialState = {
      ...initialState,
      logged: logged,
      accountDataLoading: !logged,
      accountData: !logged || PHP_GLOBALS.data.account,
    };
  }
  return initialState;
}


function Account(props){
  let [state, setState] = React.useState(getInitialState());

  function handleAuthModal(response){
    //TODO: start short polling timer
    setState(state =>({
      ...state,
      logged: true,
      accountDataLoading: false,
      accountData: response.data.account,
    }));
    console.log(response)
  }

  function setUpdating(status){
    setState(state => ({
      ...state,
      updatingChanges: status
    }));
  }

  return(
    <accountContext.Provider value={{data: state.accountData, loading: state.accountDataLoading}}>
      <LoadingBar active={state.updatingChanges}/>
      <Header currentPage={"account"}/>
      <div className="content">
        <AccountPanel setUpdating={setUpdating} />
        <ClassPanel setUpdating={setUpdating} />
      </div>
      { state.logged? '' : <AuthModal reqireData={['account']} auth={handleAuthModal}/> }
    </accountContext.Provider>
  );
}

export default Account;

