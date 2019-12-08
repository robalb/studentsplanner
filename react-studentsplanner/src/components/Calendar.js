
// https://programmingwithmosh.com/react/build-a-react-calendar-component-from-scratch/
import React from "react";
// import moment from "moment";
import moment from 'moment/min/moment-with-locales';
import {getCountryIsoWeekDay} from '../utils/time.js';

import './calendar.css';

export default class Calendar extends React.Component {
  constructor(props){
    super(props);
    var locale = 'it';
    this.state = {
      //the calendar language
      locale: locale,
      //useful for internationalizzation, wether the week starts on monday or not
      isoWeekday: getCountryIsoWeekDay(locale)
    }

    //set the moment internationalizzation parameters
    moment.locale(this.state.locale)
  }
  render() {

    //european -italian calendars have monday as the first day of the week
    //this should fix the problem
    //https://stackoverflow.com/questions/18875649/starting-the-week-on-monday-with-isoweekday
    ////generate array with all the days in a week, in order
    let weekDaysArray = [];
    //any moment would work
    let date = moment("2019-06-23T00:40:00");
    let begin = moment(date).startOf('week').isoWeekday(this.state.isoWeekday);
    for (let i=0; i<7; i++) {
      weekDaysArray.push(begin.format('ddd'));
      begin.add('d', 1);
    }
    let weekDays = weekDaysArray.map(day => {
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
          {weekDays}
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
