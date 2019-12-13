
import React from 'react';
import Calendar from '../../components/Calendar'
import Button from '../../components/Button.js';

function CalendarView(props){
  let cell = (date)=>{
    return(
      <Button className="calendar-view-cell" >
      </Button>
    );
  }
  return(
    <Calendar
    cell={cell}
    />
  );
}

export default CalendarView;
