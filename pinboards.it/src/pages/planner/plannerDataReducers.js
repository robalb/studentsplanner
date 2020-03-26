
//utils function used by some reducer.
//please apreciate its beauty
function sortDatesArray(objA, objB){
  let params = ['year','month','day']
  for(let param of params){
    let a = objA[param]
    let b = objB[param]
    if (a > b) return 1;
    if (b > a) return -1;
  }
  return 0;
}

//this is a collection of several functions
//that modify and return the provided planner data
const plannerDataReducers = {

  newEvent: (plannerData, newData) => {
    newData.dates.sort(sortDatesArray);
    return {
      ...plannerData,
      events: [plannerData.events, newData]
    };
  },

  updateEventDates: (plannerData, newData) => {
    let newEvents = plannerData.events.slice();
    newEvents[newData.eventIndex].dates = newData.dates.sort(sortDatesArray);
    return {
      ...plannerData,
      events: newEvents
    };
  },

  updateDateStudents: (plannerData, newData) => {
    let newEvents = plannerData.events.slice(0);
    newEvents[newData.eventIndex].dates[newData.dateIndex].students = newData.students
    return {
      ...plannerData,
      events: newEvents
    };
  },

  deleteEvent: (plannerData, newData) =>{
    //TODO
    return {
      ...plannerData
    }
  },

};

export default plannerDataReducers;
