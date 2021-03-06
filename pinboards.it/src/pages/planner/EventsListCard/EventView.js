import React from 'react';
import Button from '../../../components/Button.js';
import PlaceHolder from '../../../components/PlaceHolder.js';
import plannerContext from '../../../contexts/plannerContext.js';
import t from '../../../utils/i18n.js';

function EventBadge(props){
  return(
    <Button
    className="event-badge"
    style={{backgroundColor: props.baseColor}}
    onClick={props.onClick}
    aria-label={t('select event label', {name: props.name})}
    title={t('select event label', {name: props.name})}
    >{props.name}</Button>
  );
}


function EventView(props){
  const {data, loading, update, current, updateCurrent} = React.useContext(plannerContext)

  let badges = <>
    <PlaceHolder ready={false} className={'event-badge preloader'}><></></PlaceHolder>
    <PlaceHolder ready={false} className={'event-badge preloader'}><></></PlaceHolder>
  </>
  if(!loading && data.events){
    badges = data.events.map((ev, step)=>{
      return (
        <EventBadge 
          baseColor={ev.baseColor}
          onClick={() => updateCurrent(step)}
          name={ev.name}
          key={step}
        />
      )
    })
  }
  return(
    <div className="event-badges-container">
      {badges}
      <Button
      aria-label={t("create new event")}
      title={t("create new event")}
      className={ "event-badge-add" }
      onClick={()=>props.setView('event-creation')}
      ><i className="material-icons"> add_circle </i></Button>
    </div>
  );
}

export default EventView;
