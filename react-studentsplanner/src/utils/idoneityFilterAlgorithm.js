import moment from 'moment'
import colors from './colors.js';

function idoneityFilterAlgorithm(students, eventIndex, dateIndex, events){
  let currentDate = events[eventIndex].dates[dateIndex]
  students = students.map(student=> ( {
    uid: student,
    //Ok, this is kinda dirty. But so is your mother, and no one complains.
    closestDateInterval: 99,
    closestDateColor: 'transparent',
    currentMonth: currentDate.month,
    currentDay: currentDate.day,
    currentYear: currentDate.year
  } ));

  function calculateDaysDifference(date1, date2){
    //remember: months are 0 indexed
    let d1 = moment({year: date1.year, month: date1.month, day: date1.day})
    let d2 = moment({year: date2.year, month: date2.month, day: date2.day})
    let diff = d1.diff(d2, 'days')
    return Math.abs(diff)
  }

  //return the color to associate to a name based on its daysInterval - priority
  //allows easy configuration of color codes
  function defineColor(color, priority){
    //priority: bad
    if(priority==0) return color
    //priority: medium
    if( priority <= 2) return colors.RGB.linearShade(0.6, color)
    //priority: good
    return 'rgb(255,255,255)'
  }

  function compareDates(currentStudent, studentNameToMatch, date, color){
    if(currentStudent.uid == studentNameToMatch){
      //calculate the days between the current date and the date parameter
      let currentDate = {
        month: currentStudent.currentMonth,
        day: currentStudent.currentDay,
        year: currentStudent.currentYear
      }
      let calculatedDaysDifference = calculateDaysDifference(date, currentDate)
      //if the days calculated are less than the ones stored in closestDateInterval
      if(calculatedDaysDifference < currentStudent.closestDateInterval){
        currentStudent.closestDateInterval = calculatedDaysDifference
        currentStudent.closestDateColor = defineColor(color, calculatedDaysDifference)
      }
    }
    return currentStudent
  }

  for(let event of events){
    for(let date of event.dates){
      for(let student of date.students){
        students.map( current => compareDates(current, student, date, event.baseColor))
      }
    }
  }

  //now that we have a priority associated with every student in the students array, 
  //we can sort the array by priority, and set the colors based on that priority
  //sort:
  function compare(a, b) {
    a = a.closestDateInterval
    b = b.closestDateInterval
    if (a > b) return -1;
    if (b > a) return 1;
    return 0;
  }
  students.sort(compare)

  console.log("priorities:")
  students.forEach(s=>console.log(s.uid, s.closestDateInterval))
  return students.map(student=> ({uid: student.uid,
                                 color:student.closestDateColor,
                                priority: student.closestDateInterval}))
}

export default idoneityFilterAlgorithm
