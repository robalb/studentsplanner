const testData = {
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
      ]
    };

    export default testData;
