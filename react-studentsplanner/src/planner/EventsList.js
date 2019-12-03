
import React from 'react';

function EventsList(){
  return (
    <div className="card events-list">
      <div className="top-bar">
        <h2>events</h2>
        <i className="material-icons"> more_vert </i>
      </div>
      <div className="event-badges-container">
        <div className="event-badge c1">storia</div>
        <div className="event-badge c2">gr. inglese</div>
        <div className="event-badge c3">filo</div>
        <div className="event-badge c4">storia 2 qweqweqwe</div>
        <div className="event-badge c5">dante</div>
        <div className="event-badge c6">recuperi mate</div>
        <div className="event-badge c7">fisica</div>
        <div className="event-badge c8">lett. inglese</div>
        <div className="event-badge c9">italiano</div>
        <div className="event-badge-add"><i className="material-icons"> add_circle </i></div>
      </div>
    </div>
  );
}

export default EventsList;
