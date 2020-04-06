import moment from 'moment'
import colors from './colors.js';

function idoneityFilterAlgorithm(allowedStudents, eventIndex, dateIndex, events){
  // allowedStudents = ["vasari", "sarti", "sassari"];
  // console.log({allowedStudents,eventIndex, dateIndex, events});

  //utils functions
  function calculateDaysDifference(date1, date2){
    //remember: months are 0 indexed
    let d1 = moment({year: date1.year, month: date1.month, day: date1.day})
    let d2 = moment({year: date2.year, month: date2.month, day: date2.day})
    let diff = d1.diff(d2, 'days')
    return Math.abs(diff)
  }
  //deep copy - this could be avoided by rewriting everything with a functional approach
  // https://medium.com/javascript-in-plain-english/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089
  const deepCopyFunction = inObject => {
    let outObject, value, key
    if(typeof inObject !== "object" || inObject === null) {
      return inObject // Return the value if inObject is not an object
    }
    // Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {}
    for (key in inObject) {
      value = inObject[key]
      // Recursively (deep) copy for nested objects, including arrays
      outObject[key] = (typeof value === "object" && value !== null) ? deepCopyFunction(value) : value
    }
    return outObject
  }
  //custom array of object sort
  function getObjComparer(key, fromSmallest = true){
    fromSmallest = fromSmallest ? 1 : -1;
    return function compare(a, b) {
      a = a[key];
      b = b[key];
      if (a > b) return 1 * fromSmallest;
      if (b > a) return -1 * fromSmallest;
      return 0;
    }
  }


  //prepare dates template aray that will be associated to every student
  let currentEventDates = events[eventIndex].dates
  .map( date => ({
    day: date.day,
    month: date.month,
    year: date.year,
    distance: 10,
    closestEventColor: 'transparent'
  }));

  // console.log(currentEventDates);

  //an object containing for every student an array of all the dates of the current event, with the associated smaller
  //distance from any other event
  let studentsDistances = {};
  allowedStudents.forEach( student =>{
    studentsDistances[student] = deepCopyFunction(currentEventDates)
  })

  //iterate all dates of all events. when a student is found in one of the dates, updates its distances in studentsDistances
  for(let event of events){
    for(let date of event.dates){
      for(let student of date.students){
        if(studentsDistances[student]){
          //note: this could be optimize to perform less calls to calculateDaysDifference
          // console.log("updating distances for ",student,event);
          studentsDistances[student].map( currentDate => updateDistance(currentDate, date, event.baseColor))
        }
      }
    }
  }

  function updateDistance(currentDate, date, color){
    //if the stored date distance is not 0, check if the current date distance is smaller.
    //if it is, update the stored date distance
    if(currentDate.distance > 0){
      let daysDifference = calculateDaysDifference(currentDate, date);
      // console.log(daysDifference);
      if(daysDifference < currentDate.distance){
        currentDate.distance = daysDifference;
        currentDate.closestEventColor = color;
      }
    }
    return currentDate;
  }

  //prepare the array of students to return
  let currentDateSortedStudents = [];
  let currentDate = events[eventIndex].dates[dateIndex];

  //for every student
  for(let student in studentsDistances){
    //sort the studentsDistances array, by distance. The priority a date has for a student is now the
    //index position in the student dates array
    studentsDistances[student].sort(getObjComparer('distance', false));
    //get the current date object in the student dates array
    for(let i=0; i < studentsDistances[student].length; i++){
      let current = studentsDistances[student][i];
      if(current.year == currentDate.year && current.month == currentDate.month && current.day == currentDate.day){
        currentDateSortedStudents.push({
          uid: student,
          studentPriority: i,
          distance: current.distance,
          closestEventColor:current.closestEventColor
        });
        break;//i had to choose a vulgar for loop just to use this
      }
    }
  }


  //sort the studentsDistances array by priority. if the priority is the same, check the distance
  function sortPriority(objA, objB){
    let params = [
      {
        key:'studentPriority',
        fromSmall:true
      },
      {
       key: 'distance',
      fromSmall: false
      }]
    for(let param of params){
      let fromSmallest = param.fromSmall ? 1 : -1;
      let a = objA[param.key]
      let b = objB[param.key]
      if (a > b) return 1 * fromSmallest;
      if (b > a) return -1 * fromSmallest;
    }
    return 0;
  }
  currentDateSortedStudents.sort(sortPriority)


  //assign a color to every student, based on their priority and the color of their closest event
  let lastStudentPriority = 0;
  let lastDistance = 0;
  let index = 0;
  currentDateSortedStudents.map( (current)=>{
    //TODO: handle duplicates case - obj same is present
    //TODO: fix this mess
    if(index > 0 && lastStudentPriority == current.studentPriority && lastDistance == current.distance){
        // console.log("same");
    }else{
      index++;
      lastStudentPriority = current.studentPriority;
      lastDistance = current.distance;
        // console.log("not same");
    }
    current.priority = index;
    current.color = defineColor(current.closestEventColor, current.distance);
    return current;
  });
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



  // console.log(studentsDistances);
  console.log(currentDateSortedStudents);



  return currentDateSortedStudents;

  // return [
  //   {uid: 'vasari',
  //     color: 'rgb(255,255,0)',
  //     priority: 21
  //   }
  // ];
}

export default idoneityFilterAlgorithm
