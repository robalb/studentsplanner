import React from 'react';

const testData = {
  events: [
    {
      name: "int. inglese",
      repeatStudents: false,
      baseColor: "rgb(52, 172, 224)",
      dates: [
        {
          day: 10,
          month: 11,
          students: ["antonio d", "marla"]
        },
        {
          day: 13,
          month: 11,
          students: ["antonio r", "aieie"]
        }
      ]
    },
    {
      name: "storia",
      repeatStudents: false,
      baseColor: "rgb(255, 82, 82)",
      dates: [
        {
          day: 12,
          month: 11,
          students: ["antonio d", "marla"]
        },
        {
          day: 15,
          month: 11,
          students: ["antonio d", "marla"]
        }
      ]
    }
  ],
  lastEventsUpdate: '',
  loading: false
}


const plannerContext = React.createContext(testData);
export default plannerContext;
