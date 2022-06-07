const { Student } = require('../models/index').models;
const { EditHistory } = require('../models/index').models

// create a new Student
exports.create = (object, next) => {
    // asynchronous
    return new Promise((resolve,reject) => {

        // create date and format it
        const today = new Date().toLocaleDateString(undefined, { hour:"numeric", minute:"numeric", second:"numeric" })

        // add createdAt property to object
        object.createdAt = today;
        console.log(object.createdAt);

        // create new Student
        const newStudent = new Student(object);

        // add date to updatedAt
        newStudent.updatedAt.push(today);

        newStudent.save((err, student) => {
            // failed: return error
            if(err) { reject(err); }
            // success: return newly created user
            else { 
                resolve(student); 
            }
        })
    })
}

//parameter: id == objectId
exports.getOne = (query, next) => {
    //find the student using their student number
    return new Promise((resolve, reject) => {
        Student.findOne(query, (err, student) => {
            if (err) {reject(err);}
            else {resolve(student);}
        }).select("-sem.courseDetails._id -sem._id -__v -gradeErrors._id")   //you can try changing into -Student.Course._id and -Student.sem._id to see if it will work if this doesnt work too
    })
 }


//parameter: query - the data of students you want to show
// if no query provided, will give all students info
// field - on what field the result will be sorted (first_name, last_name, course, etc)
// order - whether the sort is ascending or descending (1 = ascending; -1 = descending)
exports.getMany = (query,order, next) => {
    return new Promise((resolve, reject) => {
        Student.find(query, (err, students) =>{
            if(err){reject(err);}
            else{resolve(students);}
        } )
        // Remove properties from query
        // source: https://stackoverflow.com/questions/45754551/remove-id-from-output-and-nested-element-in-mongo
        .select("-sem.courseDetails._id -sem._id -__v -gradeErrors._id") //you can try changing into -Student.Course._id and -Student.sem._id to see if it will work if this doesnt work too
        //makes the query case insensitive. Can change strength into 2 to account for more differences if needed
        // https://www.mongodb.com/docs/manual/reference/collation/
        .collation({locale: 'en', strength: 1}) 
        .sort(order)
    })
}


// delete student
//      deletes the student itself
// parameters:
//  query : { _id: ObjectId() }
exports.delete = (query) => {
    return new Promise((resolve, reject) => {
        EditHistory.deleteMany({studentId: query}, (err, result) => {
            if (err) { reject(err); }
            else { resolve(result); }
        });

        Student.deleteMany(query, (err, result) => {
            if (err) { reject(err); }
            else { resolve(result); }
        });

    })
}

// edit student data
// params:
// query -> general query containing any condition; { attrib1: condi1, ... }
// new values -> { attrib1: newvalue1 ... } -> student object
//      new values contains everything in the student object
exports.edit = (query, new_values) => {
    return new Promise((resolve, reject) => {
        // find and update
        Student.findOneAndUpdate(
            // find by query,
            query,
            // update the student found and set the new_values
            { $set: new_values },
            // options. return the modified doc
            { new:true }
        )
        .then(student => {
            // edit the date of the result from findOneAndUpdate
            // formatted date to be based on locale (yung undefined), plus have time
            student.updatedAt.push(new Date().toLocaleDateString(undefined, { hour:"numeric", minute:"numeric", second:"numeric" }));
            
            // save and resolve
            let result = student.save();

            resolve(result);
        })
        .catch(err => {
            reject(err);
        })
    })
}