
// https://programmingwithmosh.com/react/build-a-react-calendar-component-from-scratch/
import React from "react";
// import moment from 'moment/min/moment-with-locales';
import moment from "moment";

// replaces divs that behave as button with this component
// note: use this only where actual buttons are difficult to implement
import Button from './Button.js';

import './calendar.css';

export default class Calendar extends React.Component {
  constructor(props){
    super(props);
    //TODO: connect this to global app i18n
    let locale = props.locale ?? 'en';
    //set the moment internationalizzation parameters
    moment.locale(locale)

    let currentMonth = moment()
    if(props.currentMonth && currentMonth >= 0 && props.currentMonth < 13){
      currentMonth.month(props.currentMonth)
    }

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
      <nav className="header">
        <button aria-label={"previous month"} onClick={previousMonth}>
          <i className="material-icons" > arrow_left </i>
        </button>
        <div > <p>{this.state.currentMonth.format("YYYY")}</p> </div>
        <Button aria-label={"select month"} onClick={toggleMonthSelection}> <p>{this.state.currentMonth.format("MMMM")}</p> </Button>
        <button aria-label={"next month"} onClick={nextMonth}>
          <i className="material-icons" > arrow_right </i>
        </button>
      </nav>
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
          {this.props.cell(m.clone())}
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
        <button className={current} onClick={()=>monthClick(month)} key={month} >
        {month}
        </button>
      );
    });
    return <nav className="month-selection">{ months }</nav>;
  }


  render() {
    return (
      <div className="calendar-container" >
        {this.renderHeader()}

        {this.state.choosingMonth?
          this.renderMonthSelection()
          :
          <>
            { this.renderDays() }
            { this.renderCells() }
          </>
        }
      </div>
    );
  }
}
