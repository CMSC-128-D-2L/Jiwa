const { EditHistory } = require('../models/index').models;

/* 
create edit history
*/
exports.create = (user, student, description) => {
    return new Promise((resolve, reject) => {
        const object = {
            userId: user._id, // update this to tokenDetails.user._id when token verification is implemented
            studentId: student._id,
            description,
            studentFirstName: student.firstName,
            studentLastName: student.lastName,
            userEmail: user.email,
            createdAt: new Date().toLocaleDateString(undefined, { hour:"numeric", minute:"numeric", second:"numeric" }),
        }

        // create and save new editHistory
        const newEdit = new EditHistory(object);

       
        if(student.ifDelete == true){
            newEdit.ifDelete = true
        }
        
        newEdit.save((err, edit) => {
            if(err) reject(err);
            else resolve(edit);
        });
    });
}

/*
get many edit history based on user email and student name. parameters:
    userEmail,
    studentName, -> an array of the student name:
        studentName[0] = first name
        studentName[1] = second name
    order,

returns: all edits made
*/
exports.getMany = (filters, order) => {
    return new Promise((resolve, reject) => {
        console.log("================== ORDER =================");
        console.log(order);

        // populate all EditHistory
        EditHistory.find()
        .populate({
            path:'userId', // path would be the property that is a reference
            // matches according to username passed into the handler
            match: { email: filters.userEmail },
            select: '_id first_name last_name email role'
        })
        .populate({
            path:'studentId',
            // match according to the first AND last name of student. NOTE: returns NULL if does not match.
            // needs to match that hasError is also false
            match: { firstName: filters.studentFirstName, lastName: filters.studentLastName, hasError: false },
            select: '_id firstName lastName StudNo'
        })
        .exec((err, res) => {
            if(err) reject(err);

            // filter the result, remove those na walang lumabas na match
            history = res.filter(function(history) { 
                return (history.userId!=null && history.studentId!=null) || history.ifDelete == true
            })
            // sorts by most recent result
            .sort(function(a, b) {
                return Date.parse(b.createdAt) - Date.parse(a.createdAt)
            });

            resolve(history);
        });
    })
}