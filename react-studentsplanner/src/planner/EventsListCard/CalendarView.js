
import React from 'react';
import Calendar from '../../components/Calendar'

function CalendarView(props){
  return(
    <div>
      <Calendar events={props.events} />
    </div>
  );
}

export default CalendarView;
