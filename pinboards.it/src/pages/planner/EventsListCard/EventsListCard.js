import React from 'react';
import EventView from './EventView.js';
import CalendarView from './CalendarView.js';
import EventCreationView from './EventCreationView.js';
//TODO: import TestView

import t from '../../../utils/i18n.js';


function EventsListCard(){
  const [view, setView] = React.useState('events');

  let viewComponent = <p>loading..</p>
  let tabBar = <p>loading..</p>
  switch(view){
    case 'events':
      viewComponent = <EventView setView={setView}/>
      tabBar = <>
        <h2>{t('events list title')}</h2>
        </>;
      break;
    case 'event-creation':
      viewComponent = <EventCreationView setView={setView}/>
      tabBar = <>
        <h2>{t('event creation')}</h2>
        <button aria-label={t("undo event creation")}
         title={t("undo event creation")}
         onClick={()=>setView('events')}
        ><i className="material-icons">close</i></button>
        </>;
      break;
    case 'calendar':
      break;
  }

  return (
    <div className="card events-list">
      <div className="top-bar">
        {tabBar}
      </div>
      {viewComponent}
    </div>
  );
}

export default EventsListCard;
