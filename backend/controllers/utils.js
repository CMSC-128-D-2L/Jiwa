require('dotenv').config()

const User = require('../handlers/user');
const jwt = require("jsonwebtoken");
const fs = require('fs');
const parse = require('csv-parse').parse;

/**
 * Checks GWA and Running Sum of the given student object
 * Returns an object containing errors on GWA/Running Sum
 * @param {*} studentData A student object containing semesters and courses
 * @return {object} An object containing a report on errors
 */
exports.validateGradeRecords = (studentData) => {
  var errorReport = {
    id: null,
    studentName: studentData.firstName + ' ' + studentData.lastName,
    overallGradeErrors: 0,
    overallGradeDiagnostics: {
      GWA: 0,
      Units: 0,
      RunningSum: 0,
    },
    runningSumErrors: 0,
    runningSumDiagnostics: [],
    semDateErrors: 0,
    semDateDiagnostics: [],
    underloadErrors: 0,
    underloadDiagnostics: [],
    reqCourseErrors: 0,
    reqCourseDiagnostics: [],
    totalErrors: 0
  }

  //  Get the total sum
  var totalSum = studentData.totalRunningSum;
  var totalUnits = 0;
  var overallGWA = 0;
  var runningSum = 0;
  var prevSem = null;
  var currentSem = null;

  //  Iterate through semesters and courses
  studentData.sem.forEach(sem => {
    let isLOA = false;
    let semUnits = 0;
    //  Split the current sem data by either a space or a / character
    currentSem = sem.date.split(/[/\s]/);
    currentSem[0] = currentSem[0].toUpperCase()

    sem.courseDetails.forEach(course => {
      var computed

      //  Check if grade is P, if it is P, grade is converted to 0 so the course will not be counted
      if (course.Grade != 'P') 
        computed = parseFloat(course.Grade);
      else
        computed = 0;
       

      //  Set isLOA flag if sem is LOA/AWOL
      if (['LOA', 'AWOL'].includes(course.CourseID))
        isLOA = true;

      /*  Check if the current course is a thesis course:
            true: multiply grade with 6
            false: multiply grade with # of units
      */
      if (course.CourseID.search('200') > 0)
        computed *= 6;
      else if (!isNaN(parseInt(course.Units))) 
        computed *= parseInt(course.Units);
      
      //  Computed grade is valid and course is not a thesis course
      if (!isNaN(computed) && course.CourseID.search('200') < 0) {
        runningSum += computed;
        semUnits += parseInt(course.Units);
        totalUnits += parseInt(course.Units);
      
      //  Computed grade is valid and course is a thesis course
      } else if (!isNaN(computed) && course.CourseID.search('200') > 0) {
        runningSum += computed;
        semUnits += 6;
        totalUnits += 6;

      //  Count units of a course if grade is not DRP 
      } else if (!isLOA && course.Grade != "DRP") {
        semUnits += parseInt(course.Units);
        
        //  add to total units if course is not a thesis course
        if (course.CourseID.search('200') < 0)
          totalUnits += parseInt(course.Units);
      }

      /* Check if computed gradepoints is a number:
          true: check if gradepoints is equal to recorded gradepoints
          false: check if recorded gradepoints is 0
      */
      if (!isNaN(computed) && computed != course.Computed ||
        isNaN(computed) && course.Computed != 0) {

        errorReport.runningSumErrors++;
        errorReport.runningSumDiagnostics.push('Course: ' + course.CourseID);
      }
    })

    //  Additional checks when semester is not LOA/AWOL
    if (!isLOA) {
      //  Check current running sum with the semester's recorded running sum
      if (runningSum != sem.runningSum) {
        errorReport.runningSumErrors++;
        errorReport.runningSumDiagnostics.push('Sem: ' + sem.date);
      }

      /*  Check if current sem is underload
            prepandemic minimum = 15 
            pandemic minimum = 12
            midyear minimum = 0
      */
      if (currentSem[0] != 'MIDYEAR' && 
         (currentSem[1] > 19 && semUnits < 12 ||
         currentSem[1] <= 19 && semUnits < 15)) {

        studentData.notes += '. Underload Sem: ' + sem.date;
        errorReport.underloadErrors++;
        errorReport.underloadDiagnostics.push('Sem: ' + sem.date);
      }
    }

    //  Check if prevSem is not null and if current and prev sem dates are identical
    if (prevSem && prevSem.join('/') === currentSem.join('/')) {
      errorReport.semDateErrors++;
      errorReport.semDateDiagnostics.push('Sem Dupe: ' + currentSem.join('/'));

    } else if (prevSem) {
      switch (prevSem[0]) {
        case "I":
          /*  If prev sem is the 1st sem, 
                the gap between prev and current s.y. should be 0, thus they must be equal
                the current sem must also be the 2nd sem and not a midyear
          */
          if (currentSem[0] != "II" || currentSem[1] != prevSem[1] || currentSem[2] != prevSem[2]) {
            errorReport.semDateErrors++;
            errorReport.semDateDiagnostics.push('Sem Gap: ' + prevSem.join('/') + ' and ' + currentSem.join('/'));
          }
          break;
        case "II":
          /*  If prev sem is the 2nd sem and current sem is a midyear,
                the gap between prev and current s.y. should be 0, thus they must be equal
          */
          if (currentSem[0] == "MIDYEAR") {
            //  Get the last two digits of the midyear year to compare
            if (currentSem[1].slice(2) != prevSem[2]) {
              errorReport.semDateErrors++;
              errorReport.semDateDiagnostics.push('Sem Gap: ' + prevSem.join('/') + ' and ' + currentSem.join('/'));
            }

            /*  If prev sem is the 2nd sem and current sem is NOT a midyear,
                  the current sem must be the 1st sem and
                  the gap between prev and current s.y. should be 1
            */
          } else {
            if (currentSem[0] != "I" || currentSem[1] - prevSem[1] != 1 || currentSem[2] - prevSem[2] != 1) {
              errorReport.semDateErrors++;
              errorReport.semDateDiagnostics.push('Sem Gap: ' + prevSem.join('/') + ' and ' + currentSem.join('/'));
            }
          }
          break;
        case "MIDYEAR":
          /*  If prev sem is a midyear,
                the current sem must be the 1st sem and
                the year must be equal to the year of the midyear 
                (No Error: prevSem = Midyear 2016 currSem = I/16/17)
          */
          if (currentSem[0] != "I" || prevSem[1].slice(2) != currentSem[1] || currentSem[2] - currentSem[1] != 1) {
            errorReport.semDateErrors++;
            errorReport.semDateDiagnostics.push('Sem Gap: ' + prevSem.join('/') + ' and ' + currentSem.join('/'));
          }
          break;
      }
    }

    //  Store currentSem as prevSem by cloning currentSem
    prevSem = [...currentSem];
  })

  if (studentData.totalUnits != totalUnits) {
    errorReport.overallGradeErrors++;
    errorReport.overallGradeDiagnostics.Units = totalUnits;
  }

  if (studentData.totalRunningSum != runningSum) {
    totalSum = runningSum;
    errorReport.overallGradeErrors++;
    errorReport.overallGradeDiagnostics.RunningSum = runningSum;
  }

  //  Compute for GWA
  overallGWA = (totalSum / parseFloat(totalUnits)).toFixed(4);

  //  Check if calculated GWA matches with the recorded GWA
  if (overallGWA != parseFloat(studentData.GWA).toFixed(4)) {
    errorReport.overallGradeErrors++;
    //  Report calculated GWA
    errorReport.overallGradeDiagnostics.GWA = parseFloat(overallGWA);
  }

  //  underLoadError count is not added to totalErrors
  errorReport.totalErrors = errorReport.overallGradeErrors + errorReport.runningSumErrors + errorReport.semDateErrors;
  return errorReport;
}

/*this function is to check for the grade where HK 12 
is taken more than once in a single sem*/
const passedHK = (grade) => {
  if (isNaN(grade)) {
    if (grade === 'P') {
      return true
    }
  } else if (!isNaN(grade) && grade <= 3.0) {
    return true
  }
  return false
}

/**
 * Checks if required courses are taken and have had a passing grade (1.00-3.00)
 * KAS 1 and HIST 1 is treated as one
 * If grade is not in [1.00,3.00] and in [INC, DFG, DRP, 4.0, 5.0] and have not been retaken in the next semesters,
   informs that there is an issue regarding that course
 * @param {*} studentData A student object containing semesters and courses
 * @return {object} An object containing a report on errors
 */
exports.validateRequiredCourses = (studentData) => {
  const requiredGE = ["ARTS 1", "PI 10", "COMM 10", "ETHICS 1", "KAS 1", "HIST 1", "STS 1"]
  const requiredNSTP = ["NSTP 1", "NSTP 2"]
  const requiredHK = ["HK 11", "HK 12"]

  //array for all the required courses
  const allRequiredCourses = [...requiredGE, ...requiredNSTP, ...requiredHK]

  const errorReport = {
    reqCourseErrors: 0,
    reqCourseDiagnostics: []
  }

  let passedKAS1HIST1 = false
  let takenKAS1HIST1 = false
  let numOfHK12 = 0
  var semesters = studentData.sem

  allRequiredCourses.forEach((course) => {                                    //iterate through all the GE subjects
    let coursePassed = false

    for (let i = 0; i < semesters.length; i++) {                                  //iterate through all the semesters
      let semester = semesters[i]

      /*an array of objects where each object contains 
      each course details-CourseID, Grade, Units, and Computed*/
      let allCourseDetailsPerSem = Object.values(semester.courseDetails)

      /*an array containing the names of the courses taken in each semester 
          e.g: ['KAS 1(SSP)', 'CMSC 12',..]*/
      let coursesTakenPerSem = allCourseDetailsPerSem.map(inner => Object.values(inner)[0])

      /*also an array containing the names of the courses takeh in each
      semester but stripped of (MST), (SSH), and (AH) to allow better comparison 
      since some required courses have this suffix*/
      let courses = []

      //removes suffixes (MST), (SSH), and (AH) 
      coursesTakenPerSem.forEach((course) => {
        if (course.includes('(MST)')) { courses.push(course.replace('(MST)', '')) }
        else if (course.includes('(SSP)')) { courses.push(course.replace('(SSP)', '')) }
        else if (course.includes('(AH)')) { courses.push(course.replace('(AH)', '')) }
        else { courses.push(course) }
      })


      /*if the course is taken in this semester*/
      if (courses.includes(course)) {
        let index = courses.indexOf(course)
        let grade = allCourseDetailsPerSem[index].Grade

        /*if a student has yet to pass KAS 1/ HIST 1*/
        if (['KAS 1', 'HIST 1'].includes(course) && !takenKAS1HIST1 && !passedKAS1HIST1) {
          takenKAS1HIST1 = true

          /*if a student has already taken and passed KAS 1 or HIST 1, 
          the no need to check for the its equivalent counterpart*/
        } else if (['KAS 1', 'HIST 1'].includes(course) && takenKAS1HIST1 && passedKAS1HIST1) {
          continue
        }

        /*for non-numerical grades*/
        if (isNaN(grade)) {
          //if grade is P
          if (grade === "P") {
            coursePassed = true

            if (takenKAS1HIST1) {
              passedKAS1HIST1 = true
            }

            /*if the course if not HK 12, then proceed finding
            the next required courses. Otherwise, continue finding the
            rest of HK 12s*/

            if (course !== "HK 12") {
              continue
            }

          }
          //if grade is DFG, DRP, INC  
          if (takenKAS1HIST1) {
            takenKAS1HIST1 = false
          }

          /*student has passed the course*/
        } else if (!isNaN(grade) && grade <= 3.0) {
          coursePassed = true

          if (takenKAS1HIST1) {
            passedKAS1HIST1 = true
          }

          /*if course is not HK 12, continue looking for
          other courses*/
          if (course !== "HK 12") {
            continue

            //otherwise, if the course is HK 12
          } else {
            numOfHK12++    //increase the number of HK12s 

            /*it is possible to take multiple instances of HK 12 in a sem,
            this code block accounts for such cases. If HK is only taken
            once in a sem, then the code block below will not execute and will 
            instead find HK 12s in other semesters*/

            while (courses.slice(index + 1).includes('HK 12')) {
              courses = courses.slice(index + 1)
              var HKIndex = courses.indexOf('HK 12')
              var HKgrade = allCourseDetailsPerSem.slice(index + 1)[HKIndex].Grade

              if (passedHK(HKgrade)) {
                numOfHK12++
              }
              index = HKIndex
            }

          }

          /*case when student has failed the course*/
        } else if (!isNaN(grade) && grade > 3.0) {
          if (takenKAS1HIST1) {
            takenKAS1HIST1 = false
          }
        }
      }
    }
    if (!['KAS 1', 'HIST 1', 'HK 12'].includes(course)) {
      if (!coursePassed) {
        errorReport.reqCourseErrors++;
        errorReport.reqCourseDiagnostics.push(course);
      }
    }
  })

  if (!passedKAS1HIST1) {
    errorReport.reqCourseErrors++;
    errorReport.reqCourseDiagnostics.push('KAS 1/HIST 1');
  }

  if (numOfHK12 < 3) {
    errorReport.reqCourseErrors++;
    errorReport.reqCourseDiagnostics.push('HK 12');
  }

  return errorReport
}


exports.newStudent = () => {
  return(
    {
      firstName: null,
      lastName: null,
      StudNo: null,
      Course: null,
      sem: [],
      GWA: null,
      totalUnits: null,
      totalRunningSum: null,
      reqUnits: null,
      notes: null,
    }
  )
}

exports.newSem = () => {
  return(
    {
      date: null,
      courseDetails: [],
      units: null,
      runningSum: null,
    }
  )
}

exports.newCourse = () => {
  return(
    {
      CourseID: null,
      Grade: 0,
      Units: 0,
      Computed: 0,          
    }
  )
}


exports.verifyToken = (req) => {

  return jwt.verify(
            req.cookies.authToken, 
            process.env.SECRET_ACCESS_TOKEN, //signature of the token
                async (err, tokenPayload) => {
                //error in validation of token
                if(err){
                  console.log('Invalid token')
                  return {status:false, message: 'Invalid token', code: 401}
                }
                //no error in validating the token

                //get the id of the user
                let userId = tokenPayload._id;
                
                let user=null
              try{
                  user = await User.getOne({_id:userId})

                //no user found given an id
                if(!user){  
                    console.log(`User not known`);
                    return {status: false, message: `User not known`,code:401}

                //else user is found
                }else{                
                    console.log(`User\n ${user} \n has successfully logged in!`);
                    return {status: true, code: 200, user}
                }
                  
              //error when the database was queried given the id
              }catch(err){
                console.log("Error validating token");
                return {status: false, message: "Error validating token", code:500}
              }       
      })
}

exports.verifyForgotPasswordToken = (req) => {

  return jwt.verify(
            //req.body.forgotPasswordToken, 
            req.cookies.forgotPasswordToken,
            process.env.FORGOT_PASSWORD_TOKEN, //signature of the token
                async (err, tokenPayload) => {

                //error in validation of token
                if(err){
                  console.log('Invalid token')
                   return {status:false, message: 'Invalid token', code: 401}
                }
                //no error in validating the token

                //get the id of the user
                let userId = tokenPayload._id;
                
                let user=null
              try{
          
                  user = await User.getOne({_id:userId})

                //no user found given an id
                if(!user){  
                    console.log(`User not known`);
                    return {status: false, message: `User not known`,code:401}

                //else user is found
                }else{                
                    console.log(`User\n ${user} \n is valid given a token!`);
                    //temporary solution
                    //return {status: true, code: 200, user}
                    return {status: true, code: 200, user, userId}
                }
                  
              //error when the database was queried given the id
              }catch(err){
                console.log("Error validating token");
                return {status: false, message: "Error validating token", code:500}
              }       
      })
}


/**
 * Parses a csv file containing student/s
 * Returns an array of students
 * @param {*} file A single csv file
 * @return {Promise<[newStudent]>} A promise which will yield an array of students when resolved
 */
exports.parseSingleFile = async (file) => {
  // regexp
  const stud_num_pattern = new RegExp('^[0-9]{4}(-)*[0-9]{5}$');
  const course_pattern = new RegExp('^(b|B)([ASas]{1})([a-zA-Z])+$');
  const ignore_pattern = /(UNITS\sEARNED|CRSE\sNO\.)/ig; // new RegExp('^((UNITS\sEARNED) | (CRSE\sNO\.))$'); don't know why but this doesn't work
  const name_pattern = new RegExp('([A-Z]+\s?)+')
  
  const data = fs.readFileSync(file.path);

  // new list of students
  let students = [];

  //  Create a Promise to wait for parsing to finish before returning array of students
  await new Promise((resolve, reject) => {
    parse(data, (err, records) => {
      //  If there are any parsing errors, stop function by returning and send a rejection
      if (err) 
        return reject(err);
      
      // new student object
      let newStudent = this.newStudent();
      
      // new sem object
      let newSem = this.newSem();

      // new course object
      let newCourse =  this.newCourse();

      // flag for line containing gwa, required units, student number, and course
      let gwa = false;
      let reqUnits = false;
      let stud_num = false;
      let course = false;
      let total_units = false;
      let done  = true; // indicate that student data is read completely. Meaning the notes were already read

      for(line of records) {
        // check if line should be ignored
        if(ignore_pattern.test(line[0])) {
          // console.log("ignore")
          continue
        }

        // check if done reading data of a student and if new student name is available
        if(done && name_pattern.test(line[0]) && name_pattern.test(line[1])) {
          // console.log("name encountered")
          done = false
          // reset flags
          gwa = false;
          reqUnits = false;
          stud_num = false;
          course = false;
          total_units = false;
          newStudent.lastName = line[0];
          newStudent.firstName = line[1];
          continue;
        }

        // just skip lines if already done reading ang no new student available
        if(done) { 
          // console.log("done");
          continue; 
        }

        // check for student course
        if(course_pattern.test(line[0]) && !course) {
          // console.log("student course read");
          newStudent.Course = line[0];
          course = true;
          continue;
        }

        // check for student number
        if(stud_num_pattern.test(line[0]) && !stud_num) {
          // console.log("student number")
          newStudent.StudNo = line[0];
          stud_num = true
          continue;
        }

        // check for total units earned and final running sum
        if(line[0] === '' && !total_units) {
          // console.log("student total units read");
          newStudent.totalUnits = Number(line[1]);
          newStudent.totalRunningSum = Number(line[4]);
          total_units = true;
          continue;
        }

        // check for gwa
        if(line[0] === "GWA") {
          // console.log("student GWA read");
          newStudent.GWA = Number(line[1]);
          gwa = true;
          continue
        }

        // check for required units
        if(gwa === true) {
          // console.log("studemt required units read");
          newStudent.reqUnits = Number(line[0]);
          gwa = false;
          reqUnits = true;
          continue;
        }

        // check for notes
        if(reqUnits === true) {
          // console.log("notes read");
          newStudent.notes = line[0]
          reqUnits = false;
          students = [...students, newStudent];
          done = true;
          // reset newStudent
          newStudent = this.newStudent();
          continue;
        }

        // add new subject to sem
        // console.log("subject read")
        newCourse.CourseID = line[0];
        newCourse.Grade = line[1];
        newCourse.Units = line[2];
        newCourse.Computed = Number(line[3]);

        newSem.courseDetails = [...newSem.courseDetails,{...newCourse}];

        // check for sem details
        if(line[5] !== '') {
          // add sem to student details
          // console.log("one sem");
          newSem.date = line[6];
          newSem.units = Number(line[5]);
          newSem.runningSum = Number(line[4]);
          newStudent.sem = [...newStudent.sem,{...newSem}];
          newSem = this.newSem();
        }
      }

      //  Parsing file is finished, resolve promise and return array of students
      resolve();
    })
  })
  
  return students;
}

/**
 * Parses multiple csv files containing students
 * Returns an array of students
 * @param {*} files An array of files to parse
 * @return {Promise<[newStudent]>} A promise which will yield an array of students when resolved
 */
exports.parseFiles = async (files) => {
  //  Hashmap for students to add. Where key is the filename and the values are the parsed students in from the file
  const studentsMap = new Map();

  //  Create a new Promise and wait for it to resolve to finish parsing
  await new Promise((resolve, reject) => {
    //  Check if there are multiple files
    if (files.length) {
      for (let i = 0; i < files.length; i++) {
        studentsMap.set(files[i].originalFilename, null);
        //  Parse a single file
        this.parseSingleFile(files[i])
          .then(result => {
            //  Copy previously recorded students and append new students
            studentsMap.set(files[i].originalFilename, result);
  
            //  If all the files have been parsed, resolve the promise
            if (i == files.length - 1) 
              resolve();
          })
          //  Parsing failed, Promise was rejected
          .catch(err => {
            reject(err);
          })
      }
    } else {
      studentsMap.set(files.originalFilename, null);
      //  Parse a single file
      this.parseSingleFile(files)
        .then(result => {
          studentsMap.set(files.originalFilename, result);

          resolve();
        })
        //  Parsing failed, Promise was rejected
        .catch(err => {
          reject(err);
        })
    }
  })
  
  return studentsMap;
}
/*
If a student did not meet the required units
{meetRequierdUnits:1, reqUnitsDiagnostics:[nameOfStudent]}
Otherwise
{meetRequiredUnits:0, reqUnitsDiagnostics: []}
*/

exports.validateRequiredUnits = (student) => {

  var errorReport = {
    meetRequiredUnits: 0,
    reqUnitsDiagnostics: []
  }

  let name = student.firstName + " " + student.lastName

  if(student.totalUnits<student.reqUnits){
    errorReport.meetRequiredUnits++;
    errorReport.reqUnitsDiagnostics.push('Units: ' + student.reqUnits);
  }
  //console.log(errorReport)
  return errorReport

}

  /*
  Returns an object 
  {SP_thesis_error: 0, SP_thesis_diagnostics: [] }

  If an error is present when taking SP/thesis, the SP_thesis_error has a value greater than 0

  Values for SP_thesis_diagnostics:
  SP status: numerical grade on topic proposal
  SP status: non-numeric grade on code implementation
  Thesis status: No numerical grade on the third one-unit take
  Thesis Status: Thesis topic proposal obtained numerical grade

  Student did not pass/take neither thesis nor SP

  If no errors are found, SP_thesis_error is 0, and SP_thesis_diagnostics is empty
  */

exports.validateSPThesis = (student) => {


  let errorReport = {
    SP_thesis_error: 0,
    SP_thesis_diagnostics: []
  }


  //flags when a student is taking thesis
  let oneUnitCounter = 0
  let thesisTopicProposalDone = false
  let startedCountingOneUnit = false

  //flags when a student is taking SP
  let SP_TopicProposalDone = false

  let SP_passed 
  let thesis_passed

  let semesters = student.sem 

  for(let i=0; i<semesters.length; i++){
      
      //code that removes non-numeric charactersfrom the course_ID field: ['CMSC 21', 'CMSC 57'] -> ['21', '57']
      let allCourseDetailsPerSem = Object.values(semesters[i].courseDetails)
      let coursesTakenPerSem = allCourseDetailsPerSem.map(inner => Object.values(inner)[0].replace(/[^\d.-]/g, ''))
      
      //if student is not taking SP and Thesis, skip the semester
      if(!coursesTakenPerSem.includes('200') && !coursesTakenPerSem.includes('190')){
        continue
      }
      //Error: student taking SP and Thesis in the same semester
      if(coursesTakenPerSem.includes('200') && coursesTakenPerSem.includes('190')){
        break
      }

      if(coursesTakenPerSem.includes('190')){
        //console.log('Student is taking SP');
        let grade = semesters[i].courseDetails[coursesTakenPerSem.indexOf('190')].Grade

        //must get an S before proceeding with the code implementation of SP
        if(!SP_TopicProposalDone){
          if (grade === 'S'){
            //console.log('SP Status: SP topic proposal done')
            SP_TopicProposalDone = true
            continue

          }else if(grade === 'U'){
            continue

          }else if (!isNaN(grade)){
            //console.log('Error: Numerical grade on topic proposal')
            errorReport.SP_thesis_error++
            errorReport.SP_thesis_diagnostics.push('SP status: numerical grade on topic proposal')
          }
        }


        /*
        code implementation of SP
        1st condition: if grade is passing
        2nd condition: if grade is failing, start from the topic proposal stage again
        3rd condition: if grade is not numeric
          if grade is P the student has passed SP
          else if the grade is DRP this function will look for next semesters SP grade
          else [INC, DFG, ...]
            error - non-numerical grade on the code implementation of SP
        */


         if(!isNaN(grade) && parseFloat(grade)<5){
              //console.log('SP status: SP code implementation finished')
              SP_passed = true
              break
          }else if(!isNaN(grade) && parseFloat(grade) === 5){
              //console.log('SP status: SP code implementation failed')
              SP_TopicProposalDone = false
              //takingSP = false
          }else if(isNaN(grade)){
              if(grade === 'P'){
                //console.log('Student has passed SP with grade P')
                SP_passed = true
                break
              }else if(grade === 'DRP'){
                //console.log('Student has dropped SP code implementation')
                continue
              }
              console.log('SP status: non-numeric grade on code implementation')
              errorReport.SP_thesis_error++
              errorReport.SP_thesis_diagnostics.push('SP status: non-numeric grade on code implementation')
              break
          }

      }

      if(coursesTakenPerSem.includes('200')){
        //console.log('Student is taking thesis')
        let grade = semesters[i].courseDetails[coursesTakenPerSem.indexOf('200')].Grade

        //must get an S before proceeding with the code implementation of Thesis
        if (!thesisTopicProposalDone){
          //console.log('On topic proposal stage')
          if (grade === 'S'){
            //console.log(i)
            console.log('Thesis Status: Thesis topic proposal done')
            thesisTopicProposalDone = true
            continue
          }else if(grade === 'U'){
            continue
          }else if(!isNaN(grade)){
            console.log('Thesis Status: Thesis topic proposal obtained numerical grade')
            errorReport.SP_thesis_error++
            errorReport.SP_thesis_diagnostics.push('Thesis Status: Thesis topic proposal obtained numerical grade')
            break
          }
        }


        /*
        Code implementation for thesis: 3 unit + 1 + 1 + 1 
        if the first take of the 3-unit code implementation is not a passing grade, which means a grade of S,
        the student may take the the code implementation of thesis for a maximum of 3 times with 1 unit each.
        */

        /*
        if statement here is the first 3 unit for thesis code implementation 
        */
        if(!startedCountingOneUnit){
          //console.log('On code implementation stage 3-unit take')
            if (grade === 'S'){
              console.log('Started counting one unit')
              startedCountingOneUnit = true
              continue
            }else if(grade === 'P'){
              console.log('Student has passed thesis with grade P')
              thesis_passed = true
              break;
            }else if(!isNaN(grade) && grade<5){
              console.log("Thesis Status: Thesis code implementation finished on the first take")
              thesis_passed = true
              break
            }
        }
        /*
        if statement here tracks the 3 one-unit takes for SP
        */
          if(startedCountingOneUnit){
            oneUnitCounter+=1
            //console.log('On code implementation one unit stage ' + oneUnitCounter+ '-th take')
            //if grade is passing and within the 3 one-unit takes
            if(!isNaN(grade) && parseFloat(grade)<5 && oneUnitCounter<=3){
              //console.log('Thesis Status: Thesis code implementation finished within 3 one-unit takes')
              thesis_passed = true
              break
            //if grade is P and within the 3 one-unit takes
            }else if(isNaN(grade) && grade === 'P' && oneUnitCounter <=3){
              //console.log('Thesis Status: Thesis code implementation finished within 3 one-unit takes')
              thesis_passed = true
              break
            //if grade is numeric 5 and obtained from the last one-unit take
            }else if(!isNaN(grade) && parseFloat(grade) === 5 && oneUnitCounter === 3){
              //console.log('Thesis Status: Thesis code implementation failed under the available 3 one-unit takes')

              //Restart the variables
              thesisTopicProposalDone = false
              startCountingOneUnit = false
              oneUnitCounter = 0
              //takingThesis = false
              continue
            //if grade is not numeric and obtained from the last one-unit take
            }else if(isNaN(grade) && oneUnitCounter === 3){
              //console.log('Thesis status: No numerical grade on the third one-unit take')
              errorReport.SP_thesis_error++
              errorReport.SP_thesis_diagnostics.push('Thesis status: No numerical grade on the third one-unit take')
              break
            }
          }
      }
  }
  if(!SP_passed && !thesis_passed){
    //console.log('Student has neither passed SP nor thesis')
    errorReport.SP_thesis_error++
    errorReport.SP_thesis_diagnostics.push('Student did not pass/take neither thesis nor SP')
  }

  return errorReport
}