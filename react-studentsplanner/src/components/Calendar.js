
// https://programmingwithmosh.com/react/build-a-react-calendar-component-from-scratch/
import React from "react";
import moment from "moment";

import './calendar.css';

export default class Calendar extends React.Component {
  render() {
    let weekdayshort = moment.weekdaysShort();
    //europena -italian calendars have monday as the first day of the week
    //this should fix the problem
    //https://stackoverflow.com/questions/18875649/starting-the-week-on-monday-with-isoweekday
    //this will return the first day of the month in the locale name format (not really relevant with the problem)
    //new Date(2019,11,1).toLocaleDateString(undefined, { weekday: 'long' })
    weekdayshort = [ 'lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom' ];

    let weekdayshortname = weekdayshort.map(day => {
      return (
        <div key={day} >
        {day}
        </div>
      );
    });

    return (
      <div className="calendar-container">
        <div className="month-panel">
          <i className="material-icons"> arrow_left </i>
          <div> <p>2019</p> </div>
          <div> <p>gennaio</p> </div>
          <i className="material-icons"> arrow_right </i>
        </div>
        <div className="weeks-labels">
          {weekdayshortname}
        </div>
        <div className="calendar-grid">
          <div className="first-el-test">1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
          <div>5</div>
          <div>6</div>
          <div>7</div>
          <div>8</div>
          <div>9</div>
          <div>10</div>
          <div>11</div>
          <div>12</div>
          <div>13</div>
          <div>14</div>
          <div>15</div>
          
        </div>
        
      </div>
    );
  }
}
