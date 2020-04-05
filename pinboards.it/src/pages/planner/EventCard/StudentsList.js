import React from 'react';
import plannerContext from '../../../contexts/plannerContext.js';
import accountContext from '../../../contexts/accountContext.js';
import Button from '../../../components/Button.js';
import colors from '../../../utils/colors.js';
import idoneityFilterAlgorithm from '../../../utils/idoneityFilterAlgorithm.js';

function StudentsList(props){
  const {data, loading, update, current, updateCurrent} = React.useContext(plannerContext);
  const accountData = React.useContext(accountContext)

  let [pulsingIndex, setPulsingIndex] = React.useState(-1);
  //when the window is closed, clear the varaible containing the extracted student
  React.useEffect(()=>{
    setPulsingIndex(-1)
  }, [ props.targetSelection ])

  let visible = props.targetSelection ? "visible" : ""
  let classes = `card students-picker-container ${visible}`

  const handleStudentClick = updateData=>{
    update("updateDateStudents", updateData)
    props.setSelectMode(false)
  }

  let diceEnabled = false
  let handleDiceClick = ()=>{
    //just initializing..
  }

  let studentBadges = []
  if(visible){
    let eventIndex = props.targetSelection.eventIndex
    let dateIndex = props.targetSelection.dateIndex
    //the students already in this date
    let presentDateStudents = data.events[eventIndex].dates[dateIndex].students.slice()
    //the students already in this event.
    //TODO: make this configurable - in case someone wants to insert a student multiple times in the same event
    let presentEventStudents = presentDateStudents
    if(true){
      presentEventStudents =  data.events[eventIndex].dates.slice().reduce((a,c)=>a.concat(c.students),[])
    }
    //all the students in the current classroom
    let allStudents = accountData.data.students.map( student=> student.uid)
    //the students that are not already in this date
    let studentsThatCanBePicked = allStudents.filter( student=> presentEventStudents.indexOf(student) < 0)

    //TODO: make this configurable
    let idoneityFilteredStudents = idoneityFilterAlgorithm(studentsThatCanBePicked, eventIndex, dateIndex, data.events)

    //magic dice section
    let ballotStudents = idoneityFilteredStudents.filter( (student, i, a)=>(
      student.priority == a[0].priority
    ))
    diceEnabled = ballotStudents.length > 1

    handleDiceClick = ()=>{
      setPulsingIndex(Math.floor(Math.random()* ballotStudents.length))
    }

    //badges generation
    studentBadges = idoneityFilteredStudents.map((student, i)=>{
      let updateData = {
        eventIndex: eventIndex,
        dateIndex: dateIndex,
        students: [...presentDateStudents, student.uid]
      }
      let pulsing = ''
      if(diceEnabled && pulsingIndex == i) pulsing = 'pulsing';
      if(!diceEnabled && i == 0) pulsing = 'pulsing'

      return(
        <Button
        className={pulsing}
        aria-label={'select '+student.uid}
        title={`select ${student.uid} (${student.priority})`}
        key={student.uid}
        style={{backgroundColor: student.color}}
        onClick={()=>handleStudentClick(updateData)}
        >{student.uid}</Button>
      )
    })

    if(studentBadges.length < 1) studentBadges = <p>{t('no students for this date')}</p>;

  }
  return (
    <div className={classes} >
        <div className="top-bar">
          <button aria-label={"close student picker"}
          title={"close student picker"}
          onClick={()=>props.setSelectMode(false)}
          > <i className="material-icons"> close </i>
          </button>
          <div>
            <button
            aria-label={"select random student"}
            title={"select random student"}
            onClick={handleDiceClick}
            disabled={!diceEnabled}
            >
            <i className="material-icons"> casino </i>
            </button>
            <button>
            <i className="material-icons"> more_vert </i>
            </button>
          </div>
        </div>
        <div className="badges-container">
          {studentBadges}
        </div>
    </div>
      
  )
}

export default StudentsList;
