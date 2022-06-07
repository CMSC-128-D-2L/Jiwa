const os = require('os');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({ dest: os.tmpdir() });

const utils = require('./utils');
const { StudentHandler, EditHistoryHandler, UserHandler } = require('../handlers/index').handlers;

exports.addStudent = (upload.single('file'), async (req, res) => {
  /** 
   * AUTHENTICATION IS TEMPORARILY COMMENTED TO TEST ENDPOINT WITHOUT TOKEN
   */ 
   if (!req.cookies || !req.cookies.authToken) {
    res.status(401).send({message: "Unauthorized access"});
    return;
  }
  
  // validate token
  const token = await utils.verifyToken(req);

  // error validating token
  if(!token.status){
    res.status(token.code).send({ message: token.message });
    return;
  }

  /**/

  // generate randomized 32-char string
  const uploadId = crypto.randomBytes(16).toString('hex');
  const files = req.files;
  const errorReport = {
    uploadId: uploadId,
    total: 0,
    successful: 0,
    failure: 0,
    duplicate: 0,
    invalidSchema: 0,
    invalidFiles: [],
    studentReports: []
  }

  //  check if a csv file was uploaded
  if (files.file) {
    let students;

    //  Parse given file/s and wait for Promise to resolve
    try {
      students = await utils.parseFiles(files.file);
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error Parsing File/s'});
    }

    for (let [key, value] of students) {
      errorReport.total += value.length;

      //  Check if value actually contains students; if not, file is invalid/corrupted
      if (value.length == 0) {
        errorReport.total += 1;
        errorReport.failure += 1;
        errorReport.invalidFiles.push(key);

        continue;
      }

      value.forEach(newStudent => {
        //  Create an errorReport for each student in the students array
        let mainReport = utils.validateGradeRecords(newStudent);
        let courseReport = utils.validateRequiredCourses(newStudent);

        //error report for checking the required units and checking progress in SP and thesis
        let unitsReport = utils.validateRequiredUnits(newStudent);
        let SPThesisReport = utils.validateSPThesis(newStudent);

        //  Include results of validateRequiredCourses() in the main report
        mainReport.reqCourseErrors = courseReport.reqCourseErrors;
        mainReport.reqCourseDiagnostics = courseReport.reqCourseDiagnostics;

        //  Include results of validateRequiredUnits() and validateSPThesis() in the main report
        mainReport['meetRequiredUnits'] = unitsReport.meetRequiredUnits;
        mainReport['reqUnitsDiagnostics'] = unitsReport.reqUnitsDiagnostics;
        mainReport['spThesisErrors'] = SPThesisReport.SP_thesis_error;
        mainReport['spThesisDiagnostics'] = SPThesisReport.SP_thesis_diagnostics;
        
        mainReport.totalErrors += courseReport.reqCourseErrors + unitsReport.meetRequiredUnits + SPThesisReport.SP_thesis_error;

        //  Insert new fields for student schema
        newStudent['hasError'] = mainReport.totalErrors > 0;
        newStudent['gradeErrors'] = mainReport;
        newStudent['uploadId'] = uploadId;
        newStudent['uploaderId'] = token.user._id;
        newStudent['uploaderEmail'] = token.user.email


        //  Look for possible duplicates in the db using StudNo
        StudentHandler.getOne({ StudNo: newStudent.StudNo })
          .then(async found => {

            if (found) {

              //  If the current student entry has errors, replace the entry in the db`
              if (found.hasError && (token.user._id == found.uploaderId || token.user.role == 'admin')) {
                await StudentHandler.delete({ _id: found._id })
                  .then (async () => {
                    //  Create a duplicate entry to replace the one w/ errors
                    await StudentHandler.create(newStudent)
                      .then (s => {
                        mainReport.id = s._id;
                        errorReport.studentReports.push(mainReport);
                        errorReport.successful++;

                        s.ifDelete = true
                        EditHistoryHandler.create(token.user, s, 'Replaced old student entry');
                      })
                      .catch(err => {
                        console.error(err);
                        errorReport.failure++;
                        errorReport.invalidSchema++;
                        errorReport.invalidFiles.push(key);
                      });
                  })
                  .catch(err => {
                    console.error(err);
                    errorReport.failure++;
                  });
              } else {
                console.error('Error: Duplicate Student');
                errorReport.failure++;
                errorReport.duplicate++;
              }
            } else {
              //  Create a newStudent to the db
              await StudentHandler.create(newStudent)
                .then (s => {
                  mainReport.id = s._id;
                  errorReport.studentReports.push(mainReport);
                  errorReport.successful++;

                  EditHistoryHandler.create(token.user, s, 'Added new student');
                })
                .catch(err => {
                  console.error(err);
                  errorReport.failure++;
                  errorReport.invalidSchema++;
                  errorReport.invalidFiles.push(key);
                })
            }
          })
          .catch(err => {
            console.error(err);
            errorReport.failure++;
          })
          .finally(() => {
            /* Check if all the students in the students array have:
                * been added to the db; or
                * failed to be added due to errors
            */
            if (errorReport.total == errorReport.successful + errorReport.failure) {
              if (errorReport.failure > 0)
                res.status(400).send(errorReport);
              else
                res.status(201).send(errorReport);
            }
          })
      })
    }

    if (errorReport.total == errorReport.successful + errorReport.failure) {
      if (errorReport.failure > 0)
        res.status(400).send(errorReport);
      else
        res.status(201).send(errorReport);
    }

  //  csv file was not uploaded
  } else {
    const newStudent = utils.newStudent();
    let isDupe = false;
    errorReport.total = 1;
  
    //  Fill the fields of the student using req.body fields
    newStudent.firstName = req.body.firstName;
    newStudent.lastName = req.body.lastName;
    newStudent.StudNo = req.body.StudNo;
    newStudent.Course = req.body.Course;
    newStudent.sem = req.body.sem;
    newStudent.GWA = req.body.GWA;
    newStudent.totalUnits = req.body.totalUnits;
    newStudent.totalRunningSum = req.body.totalRunningSum;
    newStudent.reqUnits = req.body.reqUnits;
    newStudent.notes = req.body.notes;
  
    //  Attempt to check grade records
    try {
      var mainReport = utils.validateGradeRecords(newStudent);
      var courseReport = utils.validateRequiredCourses(newStudent);

      //error report for checking the required units and checking progress in SP and thesis
      var unitsReport = utils.validateRequiredUnits(newStudent);
      var SPThesisReport = utils.validateSPThesis(newStudent);
      
    } catch (err) {
      console.log(err);
  
      errorReport.failure++;
      errorReport['message'] = 'Error: Failed to validate grade records';
      return res.status(400).send(errorReport);
    }

    //  Include results of validateRequiredCourses() in the main report
    mainReport.reqCourseErrors = courseReport.reqCourseErrors;
    mainReport.reqCourseDiagnostics = courseReport.reqCourseDiagnostics;

    //  Include results of validateRequiredUnits() and validateSPThesis() in the main report
    mainReport['meetRequiredUnits'] = unitsReport.meetRequiredUnits;
    mainReport['reqUnitsDiagnostics'] = unitsReport.reqUnitsDiagnostics;
    mainReport['spThesisErrors'] = SPThesisReport.SP_thesis_error;
    mainReport['spThesisDiagnostics'] = SPThesisReport.SP_thesis_diagnostics;
    
    mainReport.totalErrors += courseReport.reqCourseErrors + unitsReport.meetRequiredUnits + SPThesisReport.SP_thesis_error;
    
    //  Insert new fields for student schema
    newStudent['hasError'] = mainReport.totalErrors > 0;
    newStudent['gradeErrors'] = mainReport;
    newStudent['uploadId'] = uploadId;
    newStudent['uploaderId'] = token.user._id;
    newStudent['uploaderEmail'] = token.user.email;  
    
    //  Attempt to look for duplicates in the db using StudNo
    try {
      var found = await StudentHandler.getOne({ StudNo: newStudent.StudNo })
  
    } catch (err) {
      console.log(err);
  
      errorReport.failure++;
      errorReport['message'] = 'Error: Failed to retrieve student';
      return res.status(404).send(errorReport);
    }
  
    //  Found one student and that student has inconsistencies in the record 
    //    and the current uploader is the same as the previous uploader
    if (found && found.hasError && (token.user._id == found.uploaderId || token.user.role == 'admin')) {
      try {
        await StudentHandler.delete({ _id: found._id });
        isDupe = true;
  
      } catch (err) {
        console.log(err);
  
        errorReport.failure++;
        errorReport['message'] = 'Error: Failed to replace student';
        return res.status(404).send(errorReport);
      }
    
    // Found one student but student has no inconsistencies or it is a different uploader
    } else if (found) {
      errorReport.failure++;
      errorReport.duplicate++;
      errorReport['message'] = 'Error: Duplicate Student';
      return res.status(403).send(errorReport);
    }
  
    //  Add a new student to the db
    StudentHandler.create(newStudent)
      .then(s => {
        mainReport.id = s._id;
        errorReport.successful++;
        errorReport.studentReports.push(mainReport);
  
        //  Log to edit history of what changes were made
        s.ifDelete = isDupe ? true: false
        EditHistoryHandler.create(
          token.user,
          s,
          isDupe ? 'Replaced old student entry' : 'Added new student'
        );

        res.status(201).send(errorReport);
      })
      .catch(err => {
        console.error(err);
        
        errorReport.failure++;
        errorReport.invalidSchema++;
        errorReport['message'] = 'Error: One or more required fields are missing';
        res.status(400).send(errorReport);
      });
  }
});

/**
 * Find specific student
 * @param {*} req 
 * @param {*} res 
 */
exports.getStudent = async (req,res) => {
  /** 
   * AUTHENTICATION IS TEMPORARILY COMMENTED TO TEST ENDPOINT WITHOUT TOKEN
   */ 
  if (!req.cookies || !req.cookies.authToken) {
    res.status(401).send({message: "Unauthorized access"});
    return;
  }
  
  // validate token
  const token = await utils.verifyToken(req);

  // error validating token
  if(!token.status){
    res.status(token.code).send({ message: token.message });
    return;
  }

  /**/

  const { id } = req.params;

  try{
    mongoose.Types.ObjectId(id)
  }
  catch(err){
    console.log('Invalid id')
    return res.status(400).send({message: 'Invalid id'})
  }

  try {
    const student = await StudentHandler.getOne({ _id:id })

    if(!student) {
      console.log('Student not found');
      res.status(404).send({ message: 'Student not found' })
      return;
    }
    console.log(student);
    res.status(200).send(student);
    return;
  }
  catch(err) {
    console.log(`Error searching for student in DB. ${err}`);
    res.status(500).send({ message: 'Error searching for student'})
    return;
  }
}


/**
 * Find all students
 * @param {*} req 
 * @param {*} res 
 */
 exports.getStudents = async (req,res) => {
  const blankPattern = /\S/g
  /** 
   * AUTHENTICATION IS TEMPORARILY COMMENTED TO TEST ENDPOINT WITHOUT TOKEN
   */ 
  // check if token is available 
  if (!req.cookies || !req.cookies.authToken) {
    res.status(401).send({message: "Unauthorized access"});
    return;
  }
  
  // validate token
  const token = await utils.verifyToken(req);

  // error validating token
  if(!token.status){
    res.status(token.code).send({ message: token.message });
    return;
  }

  /**/
  
  // get valid queries
  const { firstName, lastName, Course, uploadId, min, max, uploaderEmail, sortby } = req.query;

  // remove undefined
  // https://stackoverflow.com/questions/53091433/ignore-undefined-values-that-are-passed-in-the-query-object-parameter-for-mongoo
  const filters = JSON.parse(JSON.stringify({ firstName, lastName, Course, uploadId, uploaderEmail }));
  
  Object.keys(filters).forEach((key) => {
    if(!filters[key] || typeof filters[key] !== 'string' || !filters[key].match(blankPattern)) {
        filters[key] = {$regex: new RegExp(".*"), $options: 'i'}
    }
    else {
      filters[key] = {$regex: new RegExp(filters[key]), $options: 'i'}
    }
  });

  filters['hasError'] = false
  filters['GWA'] = {$gte:min || 0, $lte: max || 5}
  
  const property = JSON.parse(JSON.stringify({ sortby })).sortby;
  var sort = {};
  sort[property] = 1;
  console.log(filters)
  console.log(sort)

  try {
    const students = await StudentHandler.getMany(filters,sort); // place call to handler here
    
    if(!students) {
      console.log("No student found");
      res.status(404).send({ message: 'No student found' });
      return;
    }

    res.status(200).send(students);
    return;
  }
  catch(err) {
    console.log(`Error searching for students in DB. ${err}`);
    res.status(500).send({ message: 'Error searching for students'});
    return;
  }
}


/**
 * Edit a student on the database
 * @param {*} req 
 * @param {*} res 
 */

 exports.editStudent = async (req, res) => {
  var notFound = false;
  var hasError = false;
  const id = req.params.id;
  const objID = mongoose.Types.ObjectId(req.params.id);
  const description = req.body.description;
  let student = null;

  // Check for authorization
  if (!req.cookies || !req.cookies.authToken) {
    res.status(401).send({
        message: "Unauthorized access!"
    });
    return;
  }

  // Verify token
  let tokenDetails = await utils.verifyToken(req);

  if(!tokenDetails.status) return res.status(tokenDetails.code).send({message: tokenDetails.message})

  // Check if student id is present
  if (!id){
    res.status(400).send({
      message: "Unspecified student ID!"
    });
    return;
  }

  // Check if new data is present
  if (!req.body.NewStudentDetails){
    res.status(400).send({
      message: "Missing data!"
    });
    return;
  }

  // Check if both id and new data is resent
  if (!id && !req.body.NewStudentDetails) {
    res.status(400).send({
      message: "Missing student ID and new student details!"
    });
    return;
  }

  // check for edit description
  if(!description || !description.match(/\S/g) || description.length === 0) {
    res.status(400).send({ message: "Missing edit description"});
    return;
  }

  // Check if student exists
  await StudentHandler.getOne({"_id": objID}).then((result) => {
    // Check if no student was found given the id
    if (result == null) {
      res.status(400).send({
        message: "Student does not exist!"
      });
      notFound = true
      hasError = true
    }
	else if (result.uploaderId != tokenDetails.user._id.toString()){
    if(tokenDetails.user.role != 'admin'){
      res.status(401).send({
        message: "Unauthorized access!"
        });
      notFound = false
      hasError = true
    }
    else{
      console.log("ADMIN EDIT");
    }
	}
  }).catch((err) => {
    res.status(400).send({
      message: err.toString()
    });
    hasError = true
  });

  // Check for errors
  if (notFound || hasError) return;
  
  // Check for errors in new student data
  try {
    student = JSON.parse(req.body.NewStudentDetails)
  } catch (err) {
    student = req.body.NewStudentDetails;
    }

    student.gradeErrors = utils.validateGradeRecords(student);
    let courseReport = utils.validateRequiredCourses(student);
    let unitsReport = utils.validateRequiredUnits(student);
    let SPThesisReport = utils.validateSPThesis(student);

    student.gradeErrors.reqCourseErrors = courseReport.reqCourseErrors;
    student.gradeErrors.reqCourseDiagnostics = courseReport.reqCourseDiagnostics;
    student.gradeErrors['meetRequiredUnits'] = unitsReport.meetRequiredUnits;
    student.gradeErrors['reqUnitsDiagnostics'] = unitsReport.reqUnitsDiagnostics;
    student.gradeErrors['spThesisErrors'] = SPThesisReport.SP_thesis_error;
    student.gradeErrors['spThesisDiagnostics'] = SPThesisReport.SP_thesis_diagnostics;

    student.gradeErrors.totalErrors += courseReport.reqCourseErrors + unitsReport.meetRequiredUnits + SPThesisReport.SP_thesis_error;
    if (student.gradeErrors.totalErrors == 0) student.hasError = false;
    else student.hasError = true;
  
  // Patch new student details in database
  StudentHandler.edit({"_id": objID}, student)
  .then((result) => {
    if (!student.hasError) EditHistoryHandler.create(tokenDetails.user, result, description);
    res.status(200).send(student.gradeErrors);
  })
  .catch((err) => {
    res.status(400).send({
      message: err.toString()
    });
  });
}

/**
 * Delete a student on the database
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteStudent = async (req, res) => {

/**  
 * AUTHENTICATION IS TEMPORARILY COMMENTED TO TEST ENDPOINT WITHOUT TOKEN
 */ 
  if (!req.cookies || !req.cookies.authToken) {
    res.status(401).send({
        message: "Unauthorized access."
    });
  }

  //token validation
  const token = await utils.verifyToken(req);
  console.log(token.user.role);

  if(!token.status){
    res.status(token.code).send({message: token.message});
    return;
  }

/**/ 
  
  var deleted = 0, failed = 0, failedUploader = 0;
  var invalidId = new Array;
  var validId = new Array;
  var invalidUploader = new Array;
  const ids = req.body.ids;
  
  try{
    var reqLength = ids.length;
  }
  catch{
    console.log('Invalid property');
    res.status(501).send({ message: 'Invalid property'});
    return;
  }

  try{
    for(var i = 0; i < ids.length; i++){
      try{
        mongoose.Types.ObjectId(ids[i]);
        var student = await StudentHandler.getOne({ _id:ids[i] });
      }
      catch(err){
        console.log('Wrong format:', ids[i]);
        invalidId[failed] = ids[i];
        failed++;
        continue;
      }

      if(student.uploaderId != token.user._id.toString()){
        if(token.user.role != 'admin'){
          console.log(`user ${token.user._id} does not have permission to delete ${student._id}`)
          invalidUploader[failedUploader] = ids[i];
          failedUploader++;
          continue;
        }
        else{
          console.log("ADMIN DELETE");
        }
      }

      if(student){       
        await StudentHandler.delete({ _id: ids[i] });
        console.log(student);
        console.log('Successfully deleted student with id:', ids[i]);
        try{
          /*
          //Delete once handler is updated  
          deleteHistory.studentId = student._id;
          deleteHistory.description = 'Deleted a student';
          deleteHistory.studentFirstName = student.firstName;
          deleteHistory.studentLastName = student.lastName;
          console.log("DELETE HISTORY: ",deleteHistory)
          
          await EditHistoryHandler.create(deleteHistory);
          */
          student.ifDelete = true
          await EditHistoryHandler.create(token.user, student, 'Deleted a student');
        }
        catch(err){
          console.log(err);
        }
        validId[deleted] = ids[i];
        deleted++;
      }
      else{
        console.log('ID not found:', ids[i]);
        invalidId[failed] = ids[i];
        failed++;
      }
    }
    //console.log(reqLength);
    if(reqLength == failed){
      res.status(404).send({body: invalidId, message: "ids not found" })
      return;
    }
    else if(failed == 0 && failedUploader == 0){
      res.status(200).send({body: invalidId ,message: `Successfully deleted ${deleted} students`});
      return;
    }
    else if(validId == 0 && (failed > 0 || failedUploader > 0)){
      let invalids = invalidId.concat(invalidUploader)
      res.status(404).send({body: invalids, message: `Failed to delete student/s. ${failed} not found, ${failedUploader} invalid uploader`});
      return;
    }
    else{
      res.status(201).send({body: invalidId ,message: `Successfully deleted ${deleted} student/s but failed to delete ${failed+failedUploader} student/s. ${failed} not found, ${failedUploader} invalid uploader`});
      return;
    }
  }
  catch(err){
      console.log(`Error deleting students. ${err}`);
      res.status(501).send({ message: 'Error deleting students'});
      return;
    }
}

exports.getEditHistory = async (req,res) => {
  const blankPattern = /\S/g

  /**  
   * AUTHENTICATION IS TEMPORARILY COMMENTED TO TEST ENDPOINT WITHOUT TOKEN
   */ 
  if (!req.cookies || !req.cookies.authToken) {
    res.status(401).send({
        message: "Unauthorized access."
    });
  }

  //token validation
  const token = await utils.verifyToken(req);

  if(!token.status){
    res.status(token.code).send({message: token.message});
    return;
  }

  /**/ 

  // get valid queries
  let { userFirstName, userLastName, studentFirstName, studentLastName, userEmail, sortby } = req.query;

  let filters = { userFirstName, userLastName, studentFirstName, studentLastName, userEmail };
  
  Object.keys(filters).forEach((key) => {
    if(!filters[key] || typeof filters[key] !== 'string' || !filters[key].match(blankPattern)) {
        filters[key] = {$regex: new RegExp(".*"), $options: 'i'}
    }
    else {
      filters[key] = {$regex: new RegExp(filters[key]), $options: 'i'}
    }
  });
  
  const property = JSON.parse(JSON.stringify({ sortby })).sortby;
  var sort = {};
  sort[property] = 1;
  
  let edits = null
  try {
    edits = await EditHistoryHandler.getMany(filters, sort)

    if(edits.length === 0) {
      console.log(`No edits found`);
      res.status(200).send([]);
      return;
    }
  }
  catch(err) {
    console.log(`Error searching for edits in DB. ${err}`);
    res.status(500).send({ message: 'Error searching for edits'});
    return;
  }

  let editHistory = [];

  // for(const edit of edits) {
  //   console.log(edit);
  //   let e = {
  //     description: edit.description,
  //     createdAt: edit.createdAt,
  //     userId: edit.userId,
  //     studentId: edit.studentId,
  //     studentLastName: edit.studentLastName,
  //     studentFirstName: edit.studentFirstName,
  //     studentFullName: `${edit.studentFirstName.toUpperCase()} ${edit.studentLastName.toUpperCase()}`,
  //     email: edit.userEmail
  //   }
  //   // const user = await UserHandler.getOne({_id:edit.userId})
  //   // if(user) e['user_name'] = `${user.first_name} ${user.last_name}`
  //   // else e['user_name'] = edit.userId

  //   // const student = await StudentHandler.getOne({_id:edit.studentId})
  //   // if(student) e['student_name'] = `${student.firstName} ${student.lastName}`
  //   // else e['student_name'] = edit.studentId

  //   editHistory.push(e);
  // }
  
  res.status(200).send(edits)
}