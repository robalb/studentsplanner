import React from 'react';
import colors from '../utils/colors';
import plannerContext from '../contexts/plannerContext.js';

function EventCard(props){
  const {data, loading, update} = React.useContext(plannerContext);
  const eventData = data.events[props.eventIndex]
  const solidBaseColor = eventData.baseColor;
  const lightBaseColor = colors.RGB.linearShade(0.6, solidBaseColor)
  return(
      <div className="card event"
        style={{backgroundColor: lightBaseColor}}
      >
        <div className="top-bar"
          style={{backgroundColor: solidBaseColor}}
        >
          <h2>{ eventData.name }</h2>
          <div>
            <i className="material-icons"> more_vert </i>
            <i className="material-icons"> close </i>
          </div>
        </div>
        <div className="calendar">

          <div>
            <div className="date"><h4>4/11</h4></div>
            <div className="participants">
              <div>
                giorgio vasari
                <i className="material-icons"> close </i>
              </div>
              <div>
                mario vasari
                <i className="material-icons"> close </i>
              </div>
              <div><i className="material-icons"> add_circle</i></div>
            </div>
          </div>

          <div>
            <div className="date"><h4>5/11</h4></div>
            <div className="participants">
              <div>
                giorgio
                <i className="material-icons"> close </i>
              </div>
              <div>
                mario
                <i className="material-icons"> close </i>
              </div>
              <div>
                mario vasari
                <i className="material-icons"> close </i>
              </div>
              <div>
                mario
                <i className="material-icons"> close </i>
              </div>
              <div>
                mario 
                <i className="material-icons"> close </i>
              </div>
              <div><i className="material-icons"> add_circle</i></div>

            </div>
          </div>

          <div>
            <div className="date"><h4>10/11</h4></div>
            <div className="participants">
              <div>
                giorgio vasari
                <i className="material-icons"> close </i>
              </div>
              <div>
                francesco ferdinado
                <i className="material-icons"> close </i>
              </div>
              <div>
                mario vasari
                <i className="material-icons"> close </i>
              </div>
              <div>
                genitore1 genitore2
                <i className="material-icons"> close </i>
              </div>
              <div>
                mario vasari
                <i className="material-icons"> close </i>
              </div>
              <div><i className="material-icons"> add_circle</i></div>

            </div>
          </div>

          <div>
            <div className="date"><h4>10/1</h4></div>
            <div className="participants">
              <div><i className="material-icons"> add_circle</i></div>
            </div>
          </div>


          <div>
            <div className="date"><h4>120/11</h4></div>
            <div className="participants">
              <div>
                giorgio vasari
                <i className="material-icons"> close </i>
              </div>
              <div>
                mario vasari
                <i className="material-icons"> close </i>
              </div>
              <div><i className="material-icons"> add_circle</i></div>
            </div>
          </div>

          <div>
            <div className="date">
              <i className="material-icons"> add_circle </i>
            </div>
          </div>
        </div>
      </div>
  );
}


export default EventCard;
