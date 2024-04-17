var data = {
    "data":{
        "10030":{
            "name":"Dr. exp1",
            "email":"example@gmail.com",
            "cabin":"A502"
        },
        "10031":{
            "name":"Dr. exp2",
            "email":"example@gmail.com",
            "cabin":"A503"
        },
        "10032":{
            "name":"Dr. exp3",
            "email":"example@gmail.com",
            "cabin":"A504"
        }
    }
}

const facultyData = data.data
for (const key in facultyData) {
    if (Object.hasOwnProperty.call(facultyData, key)) {
        const element = facultyData[key];
        
    }
}