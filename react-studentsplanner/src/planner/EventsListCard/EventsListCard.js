
import React from 'react';
import colors from '../../utils/colors.js';

import ListView from './ListView.js';
import CalendarView from './CalendarView.js';
import CreationMenu from './CreationMenu.js';


class EventsListCard extends React.Component{
  constructor(props){
    super(props);
    this.state={
      //list, calendar
      //TODO: set the default as list
      viewMode: 'calendar',
      creationMenuOpen: true
    }
  }

  handleEventCreationBtn(){
    //TODO
    //spawn a popup that allows the insertion of all the data.
    //on confirm, the popup will close, and call this callback
    //with data similar to this

    //the real popup should do somethig similar to this, but:
    //choose colors that arent used first, and when they finish create them by mixing existing basecolors
    let randomColorIndex = Math.floor(Math.random()*colors.colorsList.length)
    let randomColor = colors.colorsList[randomColorIndex]
    const testEvent = {
      name: "sample event"+Math.floor(Math.random()*999),
      repeatStudents: false,
      baseColor: randomColor,
      dates: [
        {
          day: 10,
          month: 11,
          students: []
        },
        {
          day: 13,
          month: 11,
          students: []
        }
      ]
    };

    this.props.handleEventCreated(testEvent)
  }

  handleEventCreated(e){
  }

  toggleViewMode(){
    let newMode = this.state.viewMode == 'list' ? 'calendar' : 'list';
    this.setState({
      viewMode: newMode
    });

  }

  render(){
    let toggleIcon = this.state.viewMode == 'list' ? 'event' : 'view_list';

    let view = this.state.viewMode == 'list' ?
      <ListView
        events={this.props.events}
        handleEventClick={this.props.handleEventClick}
        handleEventCreationBtn={()=>this.handleEventCreationBtn()}
        />
        :
      <CalendarView
        events={this.props.events}
        />

    return (
      <div className="card events-list">
        <div className="top-bar">
          <h2>events</h2>
          <div>
            <button
            aria-label={"toggle view mode"}
            title={"toggle view mode"}
            onClick={()=>this.toggleViewMode()}>
             <i className="material-icons">{toggleIcon}</i>
            </button>
            <button
            aria-label={"events options"}
            title={"events options"}
            >
             <i className="material-icons">more_vert</i>
            </button>
          </div>
        </div>
        {view}
      </div>
    );
  }
}

export default EventsListCard;
