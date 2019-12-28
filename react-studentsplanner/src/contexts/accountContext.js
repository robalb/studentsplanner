import React from 'react';

const testData = {
  user: {
    uid: 'alberto',
    name: 'alberto',
    surname: 'ventafridda',
    locale: 'it',
    isAdmin: true,
  },
  students: [
    {
      uid: "antonio d",
      name: "antonio",
      surname: "deantoni",
      isAdmin: "true",
    },
    {
      uid: "marla",
      name: "marla",
      surname: "deantoni",
      isAdmin: "true",
    },
    {
      uid: "aieie",
      name: "aieie",
      surname: "dadadd",
      isAdmin: "true",
    },
    {
      uid: "antonio r",
      name: "rossi",
      surname: "deantoni",
      isAdmin: "true",
    },
    {
      uid: "borfio",
      name: "borfio",
      surname: "brazlof",
      isAdmin: "true",
    }
  ],
  classroomName: '5M'
}

const accountContext = React.createContext(testData);

export default accountContext;
