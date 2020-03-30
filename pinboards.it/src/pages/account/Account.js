import React from 'react';
//common imports
import Header from '../../components/Header.js';
import LoadingBar from '../../components/LoadingBar.js'
import AuthModal from '../../components/AuthModal.js'
//page specific imports
import './account.css';
import AccountPanel from './AccountPanel.js';
import ClassPanel from './ClassPanel/ClassPanel.js';
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
    inviteCode: {},
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
      inviteCode: !logged || PHP_GLOBALS.data.inviteCode
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
      inviteCode: response.data.inviteCode
    }));
    console.log(response)
  }

  function setUpdating(status){
    setState(state => ({
      ...state,
      updatingChanges: status
    }));
  }

  // <h2>{t("class settings title")}</h2>
  // <h2>{t("account settings title")}</h2>
  return(
    <accountContext.Provider value={{data: state.accountData, inviteCode: state.inviteCode, loading: state.accountDataLoading}}>
      <LoadingBar active={state.updatingChanges}/>
      <Header currentPage={"account"}/>
      <div className="content">
        <AccountPanel setUpdating={setUpdating} />
        <ClassPanel setUpdating={setUpdating} />
      </div>
      { state.logged? '' : <AuthModal currentPage={"account"} requireData={['account', 'inviteCode']} auth={handleAuthModal}/> }
    </accountContext.Provider>
  );
}

export default Account;

