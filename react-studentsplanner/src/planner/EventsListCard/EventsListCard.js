import React from 'react';
import ListView from './ListView.js';
import CalendarView from './CalendarView.js';
import CreationMenu from './CreationMenu.js';


function EventsListCard(){
  const [viewMode, setViewMode] = React.useState('list');
  const [creationMode, setCreationMode] = React.useState(true);

  function toggleViewMode(){
    setViewMode(current => current == 'list' ? 'calendar' : 'list');
  }
  
  //TODO: refactor and clean this mess into this: 
  //topBarContent = [title] [controls]
  //view = ...
  //if creationMode {
  //topBarcontent = [title] [controls]
  //view = ..
  //}
  let toggleIcon = viewMode == 'list' ? 'event' : 'view_list';
  let view = viewMode == 'list' ?  <ListView setCreationMode={setCreationMode}/>: <CalendarView/>
  if(creationMode) view = <CreationMenu setCreationMode={setCreationMode}/>

  let controls = creationMode ?
    (
      <button aria-label={"undo event ceration"}
     title={"undo event creation"}
     onClick={()=>setCreationMode(false)}
     ><i className="material-icons">close</i></button>
    )
       :
    (
      <div>
      <button aria-label={"toggle view mode"}
      title={"toggle view mode"}
      onClick={toggleViewMode}>
      <i className="material-icons">{toggleIcon}</i>
      </button>
      <button
      aria-label={"events options"}
      title={"events options"}
      >
      <i className="material-icons">more_vert</i>
      </button>
      </div>
  )
  return (
    <div className="card events-list">
      <div className="top-bar">
        <h2>{creationMode ? 'create event' : 'events' }</h2>
        {controls}
      </div>
      {view}
    </div>
  );
}

export default EventsListCard;
