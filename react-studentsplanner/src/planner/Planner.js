import React from 'react';
//common imports
import Header from '../Header.js';
//page specific imports
import EventsList from './EventsList.js';
import './planner.css';


function Planner() {
  return (
    <div>
      <Header classroomName="5M" name="alberto ventafridda" isAdmin={false} />
      <div className="content">
       <EventsList />
      </div>
    </div>
  );
}

export default Planner;
