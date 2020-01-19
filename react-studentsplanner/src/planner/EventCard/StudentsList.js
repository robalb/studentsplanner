import React from 'react';
import plannerContext from '../../contexts/plannerContext.js';
import accountContext from '../../contexts/accountContext.js';
import Button from '../../components/Button.js';
import colors from '../../utils/colors.js';
import idoneityFilterAlgorithm from '../../utils/idoneityFilterAlgorithm.js';

function StudentsList(props){
  const {data, loading, update, current, updateCurrent} = React.useContext(plannerContext);
  const accountData = React.useContext(accountContext)

  let visible = props.targetSelection ? "visible" : ""
  let classes = `card students-picker-container ${visible}`

  const handleStudentClick = updateData=>{
    update("updateDateStudents", updateData)
    props.setSelectMode(false)
  }

  let studentBadges = []
  if(visible){
    let eventIndex = props.targetSelection.eventIndex
    let dateIndex = props.targetSelection.dateIndex
    //the students already in this date
    let presentStudents = data.events[eventIndex].dates[dateIndex].students.slice()
    //all the students in the current classroom
    let allStudents = accountData.data.students.map( student=> student.uid)
    //the students that are not already in this date
    let studentsThatCanBePicked = allStudents.filter( student=> presentStudents.indexOf(student) < 0)

    //TODO: implement this
    let idoneityFilteredStudents = idoneityFilterAlgorithm(studentsThatCanBePicked, eventIndex, dateIndex, data.events)
    
    studentBadges = idoneityFilteredStudents.map(student=>{
      let updateData = {
        eventIndex: eventIndex,
        dateIndex: dateIndex,
        students: [...presentStudents, student.uid]
      }
      return(
        <Button
        label={'select '+student.uid}
        aria-label={'select '+student.uid}
        key={student.uid}
        style={{backgroundColor: student.color}}
        onClick={()=>handleStudentClick(updateData)}
        >{student.uid}</Button>
      )
    })

    if(studentBadges.length < 1) studentBadges = <p>there are no students aviable for this date</p>
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
            <button>
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
