import React from 'react';
import colors from '../../utils/colors.js';
//components
import ListView from './ListView.js';
import CalendarView from './CalendarView.js';
import CreationMenu from './CreationMenu.js';


function EventsListCard(){
  const [viewMode, setViewMode] = React.useState('list');
  const [creationMode, setCreationMode] = React.useState(false);

  function toggleViewMode(){
    if(creationMode){
      setCreationMode(false);
    }else{
      setViewMode(current => current == 'list' ? 'calendar' : 'list');
    }
  }
  
  let toggleIcon = viewMode == 'list' ? 'event' : 'view_list';
  let view = viewMode == 'list' ?  <ListView setCreationMode={setCreationMode}/>: <CalendarView/>
  if(creationMode) view = <CreationMenu setCreationMode={setCreationMode}/>
  return (
    <div className="card events-list">
      <div className="top-bar">
        <h2>events</h2>
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
      </div>
      {view}
    </div>
  );
}

export default EventsListCard;
