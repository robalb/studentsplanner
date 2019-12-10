
// https://programmingwithmosh.com/react/build-a-react-calendar-component-from-scratch/
import React from "react";
// import moment from "moment";
import moment from 'moment/min/moment-with-locales';
import dateFns from "date-fns";

import './calendar.css';

export default class Calendar extends React.Component {
  constructor(props){
    super(props);
    var locale = 'it';
    //set the moment internationalizzation parameters
    moment.locale(locale)

    this.state = {
      //the calendar language
      locale: locale,
      //TODO: optionally receive this as prop
      currentMonth: moment(),
      choosingMonth: false
    }

  }

  renderHeader(){
    let previousMonth = ()=>{
      let newMonth = this.state.currentMonth.clone().subtract(1, 'M');
      this.setState({
        currentMonth: newMonth
      });
    }
    let nextMonth = ()=>{
      let newMonth = this.state.currentMonth.clone().add(1, 'M');
      this.setState({
        currentMonth: newMonth
      });
    }
    let toggleMonthSelection = ()=>{
      this.setState({
        choosingMonth: !this.state.choosingMonth
      });
    }

    return(
      <div className="header">
        <i className="material-icons" onClick={previousMonth}> arrow_left </i>
        <div > <p>{this.state.currentMonth.format("YYYY")}</p> </div>
        <div onClick={toggleMonthSelection}> <p>{this.state.currentMonth.format("MMMM")}</p> </div>
        <i className="material-icons" onClick={nextMonth}> arrow_right </i>
      </div>
    );
  }
  renderDays(){
    //european -italian calendars have monday as the first day of the week
    //in order to get the week days in the correct order - aka iso order, pass true
    //to the weekdays function
    let weekDaysArray = moment.weekdaysShort(true);
    let weekDays = weekDaysArray.map(day => {
      return (
        <div key={day} >
        {day}
        </div>
      );
    });
    return <div className="days">{ weekDays }</div>;
  }

  renderCells(){
    return(
      <div className="cells">
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
    );
  }
  renderMonthSelection(){
    let monthsArray = moment.months(true);
    let monthClick = m=>{
      let newMonth = this.state.currentMonth.clone().month(m);
      this.setState({
        choosingMonth: false,
        currentMonth: newMonth
      });
    }
    let months = monthsArray.map(month => {
      let current = (month == this.state.currentMonth.format('MMMM')) ?
        'current' : '';
      return (
        <div className={current} onClick={()=>monthClick(month)} key={month} >
        {month}
        </div>
      );
    });
    return <div className="month-selection">{ months }</div>;
  }

  render() {
    return (
      <div className="calendar-container">
        {this.renderHeader()}

        {this.state.choosingMonth?
          this.renderMonthSelection()
          :
          [ this.renderDays(), this.renderCells() ]
        }
      </div>
    );
  }
}
