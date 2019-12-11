
import React from 'react';
import Calendar from '../../components/Calendar'

function CalendarView(props){
  let cell = (date)=>{
    return(
      <div className="calendar-view-cell" >
      </div>
    );
  }
  return(
    <div>
      <Calendar
        cell={cell}
      />
    </div>
  );
}

export default CalendarView;
