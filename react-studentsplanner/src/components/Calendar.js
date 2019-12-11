
// https://programmingwithmosh.com/react/build-a-react-calendar-component-from-scratch/
import React from "react";
// import moment from "moment";
import moment from 'moment/min/moment-with-locales';

import './calendar.css';

export default class Calendar extends React.Component {
  constructor(props){
    super(props);
    //TODO: connect this to global app i18n
    let locale = 'it';
    //set the moment internationalizzation parameters
    moment.locale(locale)

    let currentMonth = props.currentMonth ? props.currentMonth : moment()

    this.state = {
      //the calendar language
      locale: locale,
      //TODO: optionally receive this as prop
      currentMonth: currentMonth,
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
    //the correct order is automatically taken into account by methods such as startOf(week)
    let weekDaysArray = moment.weekdaysShort(true);
    let weekDays = weekDaysArray.map(day => {
      return (
        <div key={day} >
        {day}
        </div>
      );
    });
    return <div className="days" key={1}>{ weekDays }</div>;
  }


  getCellsRange(from, to, optionalClass){
    let c = [];
    for(let m = moment(from); m.isBefore(to); m.add(1, 'day')){
      let key = m.format('D M Y')
      let day = m.format('D')
      let classes = "";
      let isInPast = !moment().isBefore(m.clone().add(1, 'day'));
      if(isInPast) classes += ' in-past';
      if(optionalClass) classes += ` ${optionalClass}`;
      c.push(
        <div
          key={key}
          className={classes}
        >
          <div className="primary"> <p>{day}</p> </div>
          {this.props.cell(m)}
        </div>
      );
    }
    return c;
  }


  renderCells(){
    let currentMonthCells = ()=>{
      let a = this.state.currentMonth.clone().startOf('month');
      let b = this.state.currentMonth.clone().endOf('month');
      return this.getCellsRange(a, b);
    }
    let previousCells = ()=>{
      let b = this.state.currentMonth.clone().startOf('month');
      let a = b.clone().startOf('week');
      return this.getCellsRange(a, b, 'prev');
    }
    let nextCells = ()=>{
      let a = this.state.currentMonth.clone().endOf('month').add(1, 'day');
      let b = a.clone().endOf('week').add(1, 'day');
      //avoid rendering an entire row (we've added a day to b, in order to iterate the correct number of cells
      //since we iterate on a zero based system. but the dates are not, and therefore if there are 6 extra days, adding one
      //will overflow into the next week, causing getCellsRange to generate a full week)
      if (b.format('D') == 8) return;
      return this.getCellsRange(a, b, 'next');
    }
    return(
      <div className="cells" key={0}>
        {previousCells()}
        {currentMonthCells()}
        {nextCells()}
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
