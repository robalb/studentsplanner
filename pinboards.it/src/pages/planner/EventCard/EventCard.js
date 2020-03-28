import React from 'react';
import colors from '../../../utils/colors.js';
import plannerContext from '../../../contexts/plannerContext.js';

import EditMenu from './EditMenu.js';
import Button from '../../../components/Button.js';
import StudentsList from './StudentsList.js';

import t from '../../../utils/i18n.js';


function EventCard(props){
  const {data, loading, update, current, updateCurrent} = React.useContext(plannerContext);
  const eventData = data.events[props.eventIndex]
  const solidBaseColor = eventData.baseColor;
  const lightBaseColor = colors.RGB.linearShade(0.6, solidBaseColor)

  const [editMode, setEditMode] = React.useState(false)
  const [selectMode, setSelectMode] = React.useState(false)

  //closes the edit menu of the current event if a new event is selected
  React.useEffect(()=>{
    setEditMode(false)
    setSelectMode(false)
  }, [ props.eventIndex ])


  let handleDeleteStudent =(dateIndex, data, student)=>{
    //TODO: add a confirm popup or something like that
    update("updateDateStudents", {
      eventIndex: props.eventIndex,
      dateIndex: dateIndex,
      students: data.students.filter(current=>current != student)
    })
  }
  let handleAddStudent = dateIndex=>{
    setSelectMode({
      dateIndex: dateIndex,
      eventIndex: props.eventIndex
    })

  }


  let generateRow = (data, index)=>{
    //TODO: make this international
    let date = data.day +"/"+ (data.month + 1)
    //generate participants tag list
    let participants = ""
    if(data.students.length > 0){
      participants = data.students.map(student=>(
        <div key={student} >
        {student}
        <button aria-label={t("remove student", {name: student})}
        title={t("remove student", {name: student})}
        onClick={()=>handleDeleteStudent(index, data, student)}
        > 
        <i className="material-icons"> close </i>
        </button>
        </div>
      ))
    }
    return (
      <div key={index}>
        <div className="date"><h4>
        {date}
        </h4></div>
        <div className="participants">
          {participants}
          <Button aria-label={t("add student")}
          title={t("add student")}
          onClick={()=>handleAddStudent(index)}><i className="material-icons"> add_circle</i></Button>
        </div>
      </div>
    );
  }

  //TODO: underatand why this code works even tho this line is not in a useEffect function as it should
  let dates = eventData.dates.map( generateRow )

  let cardContent = editMode ? (
    <EditMenu setEditMode={setEditMode} eventIndex={props.eventIndex}/>
  ) : (
    <div className="calendar">
      {dates}
    </div>
  )
  return(
      <div className="card event"
        style={{backgroundColor: lightBaseColor}}
      >
        <div className="top-bar"
          style={{backgroundColor: solidBaseColor}}
        >
          <StudentsList targetSelection={selectMode} setSelectMode={setSelectMode} />
          <h2>{ eventData.name }</h2>
          <div>
          <button aria-label={t("edit event")}
          title={t("edit event")}
          onClick={()=>setEditMode(!editMode)}
          > <i className="material-icons"> edit </i></button>
          <button aria-label={t("close event card")}
          title={t("close event card")}
          onClick={()=>updateCurrent(undefined)}
          ><i className="material-icons">close</i></button>
          </div>
        </div>
        {cardContent}
      </div>
  );
}


export default EventCard;
