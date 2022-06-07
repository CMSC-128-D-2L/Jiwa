import styles from "./UploadDocs.module.css";
import { useLocation } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Link, useNavigate } from "react-router-dom";
import { StepIndicator } from "../../components/StepIndicator";
import { InconsistencyTable } from "../../components/InconsistencyTable";
import { apiUrl } from "../../utilities/apiUrl";

const MAX_FILES = 50;
const headers = {
  courseCode: "Course Code",
  nUnits: "No. of Units",
  grade: "Grade",
  runningSum: "Running Sum",
  totalUnits: "Total Units",
  semester: "Semester",
};

export const UploadDocs = () => {
  const { state } = useLocation();

  const [stepNumber, setStepNumber] = useState(1);
  const [files, setFiles] = useState([]);

  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  // the index of the current student being fixed in the errorStudents list
  const [currentErrorStudent, setCurrentErrorStudent] = useState(0);
  // contains necessary student data like name, id, and required courses
  const [errorStudents, setErrorStudents] = useState([]);
  // contains student data in the form of table rows for the GUI
  const [errorStudentData, setErrorStudentData] = useState([]);

  const [uploadId, setUploadId] = useState("");
  // boolean value if success or failed upload page should be shown
  const [uploadSuccess, setUploadSuccess] = useState(true);
  // statistics of the upload, from the POST request
  const [uploadReport, setUploadReport] = useState({});

  const [currentReqUnits, setCurrentReqUnits] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "unset";
    if (state) {
      handleUpload();
    }
  }, []);

  const resetState = () => {
    setStepNumber(1);
    setFiles([]);
    setIsUploading(false);
    setCurrentErrorStudent(0);
    setErrorStudents([]);
    setErrorStudentData([]);
  };

  const updateInconsistencies = (row, col, value) => {
    let temp = [...errorStudentData];
    temp[currentErrorStudent][row] = {
      ...temp[currentErrorStudent][row],
      [col]: value,
    };
    setErrorStudentData(temp);
  };

  const processInconsistencies = (data) => {
    // console.log(data);

    // students from the response with errors
    let errorStudentsRes = data.studentReports.filter(
      (student) => student.totalErrors > 0
    );

    if (errorStudentsRes.length < 1) {
      setStepNumber(3);
      return;
    }

    setErrorStudents(
      errorStudentsRes.map((student) => ({
        name: student.studentName,
        id: student.id,
        meetRequiredUnits: student.meetRequiredUnits,
        reqCourseDiagnostics: student.reqCourseDiagnostics,
        semDateDiagnostics: student.semDateDiagnostics,
        spThesisDiagnostics: student.spThesisDiagnostics,
        underloadDiagnostics: student.underloadDiagnostics,
        totalErrors: student.totalErrors,
      }))
    );

    errorStudentsRes.map((student) => {
      populateErrorStudentData(student, -1);
    });
  };

  const addRow = () => {
    let newRow = {
      courseCode: {
        value: "",
        isInconsistent: "Enter course code",
      },
      nUnits: {
        value: "",
        isInconsistent: "Enter number of units",
      },
      grade: { value: "", isInconsistent: "Enter grade" },
      runningSum: {
        value: "",
        isInconsistent: "Enter running sum",
      },
      totalUnits: { value: null, isInconsistent: false },
      semester: { value: "", isInconsistent: "Enter semester" },
    };
    let temp = [...errorStudentData];
    temp[currentErrorStudent] = [newRow, ...temp[currentErrorStudent]];
    setErrorStudentData(temp);
  };

  const deleteRow = (index) => {
    let temp = [...errorStudentData];
    temp[currentErrorStudent].splice(index, 1);
    setErrorStudentData(temp);
  };

  /**
   * Given an inconsistent student object, fetch all of its data and create a table for editing inconsistencies.
   * This table will be pushed in the errorStudentData list.
   * @param {object} student A student object from the response of an upload POST request
   * @param {int} index The index where the data will be placed in errorStudentData. Use -1 to place the data at the end
   */
  const populateErrorStudentData = (student, index) => {
    let studentCompleteData;

    fetch(apiUrl(`/student/${student.id}`), {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setCurrentReqUnits(data.reqUnits);

        studentCompleteData = data;

        let rows = [];
        // for required courses not found in the file
        if (student.reqCourseErrors > 0) {
          student.reqCourseDiagnostics.forEach((course) => {
            rows.push({
              courseCode: {
                value: course,
                isInconsistent:
                  course === "KAS 1/HIST 1"
                    ? "Please enter either 'KAS 1' or 'HIST 1'"
                    : false,
              },
              nUnits: {
                value: "",
                isInconsistent: "Enter number of units",
              },
              grade: { value: "", isInconsistent: "Enter grade" },
              runningSum: {
                value: "",
                isInconsistent: "Enter running sum",
              },
              totalUnits: { value: null, isInconsistent: false },
              semester: { value: "", isInconsistent: "Enter semester" },
            });
          });
        }

        // build all the remaining rows
        studentCompleteData.sem.forEach((sem) => {
          sem.courseDetails.forEach((course) => {
            // rows for courses
            rows.push({
              courseCode: {
                value: course.CourseID,
                isInconsistent: false,
              },
              nUnits: {
                value: course.Units,
                isInconsistent: false,
              },
              grade: {
                value: course.Grade,
                isInconsistent: false,
              },
              runningSum: {
                value: course.Computed,
                // find if course is in the running sum diagnotics courses
                isInconsistent: student.runningSumDiagnostics.some(
                  (entry) => entry.substring(8) === course.CourseID
                )
                  ? "Inconsistent running sum"
                  : false,
              },
              totalUnits: { value: null, isInconsistent: false },
              semester: { value: null, isInconsistent: false },
            });
          });
          // rows for semester summary
          rows.push({
            courseCode: {
              value: null,
              isInconsistent: false,
            },
            nUnits: {
              value: null,
              isInconsistent: false,
            },
            grade: {
              value: null,
              isInconsistent: false,
            },
            runningSum: {
              value: sem.runningSum,
              // find if sem is in the running sum diagnotics semesters
              isInconsistent: student.runningSumDiagnostics.some(
                (entry) => entry.substring(5) === sem.date
              )
                ? "Inconsistent running sum"
                : false,
            },
            totalUnits: {
              value: sem.units,
              isInconsistent: false,
            },
            semester: {
              value: sem.date,
              isInconsistent: student.semDateDiagnostics.some(
                (entry) => entry.substring(10) === sem.date
              )
                ? "Duplicate semester"
                : false,
              isSummary: true,
            },
          });
        });

        // row for student summary
        rows.push({
          courseCode: {
            value: null,
            isInconsistent: false,
          },
          nUnits: {
            value: studentCompleteData.totalUnits,
            isInconsistent: student.overallGradeDiagnostics.Units
              ? `Inconsistent total units. Server calculation: ${student.overallGradeDiagnostics.Units}`
              : false,
          },
          grade: {
            value: studentCompleteData.GWA,
            isInconsistent: student.overallGradeDiagnostics.GWA
              ? `Inconsistent GWA. Server calculation: ${student.overallGradeDiagnostics.GWA}`
              : false,
          },
          runningSum: {
            value: studentCompleteData.totalRunningSum,
            isInconsistent: student.overallGradeDiagnostics.RunningSum
              ? `Inconsistent total running sum. Server calculation: ${student.overallGradeDiagnostics.RunningSum}`
              : false,
          },
          totalUnits: {
            value: null,
            isInconsistent: false,
          },
          semester: {
            value: null,
            isInconsistent: false,
            isSummary: true,
          },
        });

        if (index === -1) {
          setErrorStudentData((errorStudentData) => [
            ...errorStudentData,
            rows,
          ]);
        } else {
          let temp = [...errorStudentData];
          temp[index] = rows;
          setErrorStudentData(temp);
        }
        // console.log(errorStudentData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleUpload = () => {
    // prevent multiple upload clicks
    if (isUploading) return;
    setIsUploading(true);

    // if there is a state (from create student), upload the object
    // else, upload the files
    let data = new FormData();
    if (!state) {
      for (const file of files) {
        data.append("file[]", file, file.name);
      }
    }

    const payload = state
      ? {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(state),
          credentials: "include",
        }
      : {
          method: "POST",
          body: data,
          credentials: "include",
        };

    fetch(apiUrl("/student/"), payload)
      .then((response) => {
        if (!response.ok && response.status !== 400) throw response;
        return response.json();
      })
      .then((data) => {
        setUploadReport(data);

        if (data.successful === 0) {
          setUploadSuccess(false);
          setStepNumber(3);
          return;
        }

        setIsUploading(false);
        setStepNumber(2);
        processInconsistencies(data);
        setUploadId(data.uploadId);
      })
      .catch((error) => {
        setIsUploading(false);
        if (error.text) {
          error.text().then((errorMessage) => {
            console.log(errorMessage);
          });
        } else {
          console.log("Error");
        }
      });
  };

  const handleSubmit = () => {
    // prevent multiple upload clicks
    if (isUploading) return;
    setIsUploading(true);

    let { id } = errorStudents[currentErrorStudent];

    let student = convertRowsToSems(errorStudentData[currentErrorStudent]);

    student.reqUnits = currentReqUnits;

    let payload = new FormData();
    payload.append("NewStudentDetails", JSON.stringify(student));
    payload.append(
      "description",
      "Corrected inconsistencies, detected on upload"
    );

    // console.log(JSON.stringify(student));

    // console.log({ NewStudentDetails: student });
    fetch(apiUrl(`/student/${id}`), {
      method: "PUT",
      body: payload,
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) throw response;
        return response.json();
      })
      .then((data) => {
        setIsUploading(false);
        // console.log(data);

        // check if the submitted student still contains inconsistencies
        if (data.totalErrors > 0) {
          // get the previous id (the backend does not provide the id again)
          data.id = id;

          // update the inconsistencies for the student
          let temp = [...errorStudents];

          temp[currentErrorStudent].totalErrors = data.totalErrors;
          temp[currentErrorStudent].runningSumDiagnostics =
            data.runningSumDiagnostics;
          temp[currentErrorStudent].reqCourseDiagnostics =
            data.reqCourseDiagnostics;
          temp[currentErrorStudent].semDateDiagnostics =
            data.semDateDiagnostics;
          temp[currentErrorStudent].spThesisDiagnostics =
            data.spThesisDiagnostics;
          temp[currentErrorStudent].underloadDiagnostics =
            data.underloadDiagnostics;
          setErrorStudents(temp);

          // rebuild the table by updating its contents
          populateErrorStudentData(data, currentErrorStudent);
        } else {
          if (currentErrorStudent + 2 > errorStudents.length) {
            // all students have been verified, proceed to last page
            setStepNumber(stepNumber + 1);
          } else {
            // proceed to the next error student
            setCurrentErrorStudent(currentErrorStudent + 1);
          }
        }

        // scroll to the top of the page
        window.scroll(0, 0);
      })
      .catch((error) => {
        setIsUploading(false);
        if (error.text) {
          error.text().then((errorMessage) => {
            console.log(errorMessage);
          });
        } else {
          console.log("Error");
        }
      });
  };

  /**
   * Check if there are empty cells in the table
   * @param {rows} rows List of rows from the table
   * @returns true if there is at least one cell that is empty
   */
  const checkForEmptyRows = (rows) => {
    for (let row of rows) {
      // skip AWOL and LOA when checking for empty rows
      if (row.courseCode.value === "AWOL" || row.courseCode.value === "LOA")
        continue;
      if (Object.keys(row).some((key) => row[key].value === "")) {
        return true;
      }
    }
    return false;
  };

  /**
   * Convert the table rows to a student object containing sems[] and other data
   * @param {array} rows List of rows from the table
   * @returns A backend student object to be used in the PUT request
   */
  const convertRowsToSems = (rows) => {
    // list of all semesters
    let sems = [];
    // temporary collector of courses for a semester
    let sem = [];
    // list of newly created required courses
    let newCourses = [];

    for (let row of rows) {
      if (!row.semester.value) {
        // row is a course, collect it in the sem list
        sem.push({
          CourseID: row.courseCode.value,
          Units: row.nUnits.value,
          Grade: row.grade.value,
          Computed: row.runningSum.value,
        });
      } else {
        if (row.semester.value && !row.totalUnits.value) {
          // row is a new course, collect it in the newCourses list
          newCourses.push({
            CourseID: row.courseCode.value,
            Units: row.nUnits.value,
            Grade: row.grade.value,
            Computed: row.runningSum.value,
            semester: row.semester.value,
          });
        } else {
          // row is a semester summary, put the collected sem to sems list
          sems.push({
            courseDetails: sem,
            date: row.semester.value,
            runningSum: row.runningSum.value,
            units: row.totalUnits.value,
          });
          sem = [];
        }
      }
    }

    // put all the new courses in their respective semesters
    for (let course of newCourses) {
      let found = false;
      for (let sem of sems) {
        if (sem.date === course.semester) {
          sem.courseDetails.push(course);
          found = true;
          break;
        }
      }
      if (!found) {
        sems.push({
          courseDetails: [course],
          date: course.semester,
          runningSum: course.Computed,
          units: course.Units,
        });
      }
    }

    return {
      sem: sems,
      GWA: sem[0].Grade,
      totalRunningSum: sem[0].Computed,
      totalUnits: sem[0].Units,
    };
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        if (files.length >= MAX_FILES) {
          return;
        }
        if (
          files.filter((savedfile) => savedfile.name === file.name).length < 1
        ) {
          setFiles((files) => [...files, file]);
        }
      });
    },
    [files]
  );

  const removeFile = (filename) => {
    setFiles((files) => files.filter((file) => file.name !== filename));
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: "text/csv, application/vnd.ms-excel",
    multiple: true,
    noClick: true,
  });

  return (
    <div className={`d-flex flex-column ${styles.uploadPage}`}>
      <div className="container-fluid flex-grow-1 d-flex flex-column">
        <StepIndicator title="Upload Documents" currentStep={stepNumber} />
        <div
          className={`row flex-grow-1 bg-white ${styles.uploadBoxContainer}`}
        >
          <div className="col-12">
            {stepNumber === 1 && (
              <>
                <div className="row justify-content-center">
                  <div className="col-md-6 col-sm-12 m-4 text-center">
                    <h2>Select Files</h2>
                    <p>
                      Select the files to be uploaded from your computer. You
                      can only select csv files. You can upload a maximum of 50
                      files at once.
                    </p>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-md-6 col-sm-12">
                    <div
                      className={`${styles.uploadBox} ${
                        isUploading && styles.disabled
                      }`}
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      {files.length ? (
                        <>
                          <ul
                            className={`list-group w-100 ${styles.uploadList}`}
                          >
                            {files.map((file, i) => (
                              <li
                                className="list-group-item mx-4 my-1 d-flex justify-content-between align-items-center"
                                key={file + i}
                              >
                                <p className="text-truncate m-0">{file.name}</p>
                                <button
                                  className={`${styles.removeFile} btn `}
                                  onClick={() => removeFile(file.name)}
                                >
                                  <i className="bi bi-x"></i>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <>
                          <p>Drag and drop your files here</p>
                          <p>OR</p>
                          <button className={styles.button} onClick={open}>
                            BROWSE FILES
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-md-6 col-sm-12 m-1 d-flex justify-content-end">
                    <i>{files.length} file(s) selected</i>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-md-6 col-sm-12 m-2 d-flex justify-content-center">
                    <button
                      className={styles.button}
                      onClick={() => navigate("/create-student")}
                    >
                      CREATE FILE
                    </button>
                    {files.length > 0 && (
                      <button className={styles.button} onClick={open}>
                        BROWSE FILES
                      </button>
                    )}
                    <button
                      className={styles.button}
                      disabled={!files.length}
                      onClick={handleUpload}
                    >
                      {isUploading && (
                        <span
                          className="spinner-border spinner-border-sm mx-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      )}
                      {isUploading ? "UPLOADING..." : "UPLOAD"}
                    </button>
                  </div>
                </div>
              </>
            )}
            {stepNumber === 2 && (
              <div className="row justify-content-center">
                <div className="col-lg-10 col-md-12 col-sm-12 m-4 text-center">
                  <h2>File Verification</h2>
                  <p className="text-danger">
                    <b>{errorStudents.length}</b> inconsistent student data
                    detected.
                  </p>
                  <h5>
                    <strong>
                      Currently fixing student {currentErrorStudent + 1} of{" "}
                      {errorStudents.length}
                    </strong>
                  </h5>
                  <p>
                    Hover on an inconsistent cell to see mode details about the
                    inconsistency. Please fix all the inconsistencies and then
                    click NEXT.
                  </p>
                  <p className="text-danger">
                    There{" "}
                    {errorStudents[currentErrorStudent].totalErrors > 1
                      ? "are"
                      : "is"}{" "}
                    <b>{errorStudents[currentErrorStudent].totalErrors}</b>{" "}
                    {errorStudents[currentErrorStudent].totalErrors > 1
                      ? "inconsistencies"
                      : "inconsistency"}{" "}
                    left to be fixed on this student.
                  </p>
                  {errorStudentData.length > 0 && (
                    <>
                      <div className="row">
                        <div className="col">
                          <p className={styles.label}>Full Name</p>
                          <h3 className={styles.info}>
                            {errorStudents[currentErrorStudent].name}
                          </h3>
                        </div>
                        <button className={styles.button} onClick={addRow}>
                          ADD ROW
                        </button>
                      </div>
                      <div className={styles.tableContainer}>
                        <InconsistencyTable
                          data={errorStudentData[currentErrorStudent]}
                          headers={headers}
                          onChange={(row, col, value) =>
                            updateInconsistencies(row, col, value)
                          }
                          deleteRow={deleteRow}
                        />
                      </div>
                      {errorStudents[
                        currentErrorStudent
                      ].semDateDiagnostics.map(
                        (error, i) =>
                          error.includes("Sem Gap:") && (
                            <p key={i} className="text-danger">
                              <b>Other inconsistency:</b> Semester gap between{" "}
                              {error.substring(9)}
                            </p>
                          )
                      )}
                      {errorStudents[currentErrorStudent].meetRequiredUnits >
                        0 && (
                        <p className="text-danger">
                          <b>Other inconsistency:</b> Student does not meet
                          required total units.
                        </p>
                      )}
                      {errorStudents[
                        currentErrorStudent
                      ].spThesisDiagnostics.map((error, i) => (
                        <p key={i} className="text-danger">
                          <b>Other inconsistency:</b> {error}
                        </p>
                      ))}
                    </>
                  )}
                  {errorStudents[currentErrorStudent].underloadDiagnostics.map(
                    (error, i) => (
                      <p key={i} className="text-primary">
                        <b>Underload sem:</b>
                        {error.substring(4)}
                      </p>
                    )
                  )}
                  {errorStudentData.length > 0 &&
                    checkForEmptyRows(
                      errorStudentData[currentErrorStudent]
                    ) && (
                      <p className="text-danger">
                        Do not leave any cell blank.
                      </p>
                    )}
                  <button
                    className={styles.button}
                    disabled={
                      errorStudentData.length &&
                      checkForEmptyRows(errorStudentData[currentErrorStudent])
                    }
                    onClick={handleSubmit}
                  >
                    {isUploading && (
                      <span
                        className="spinner-border spinner-border-sm mx-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    )}
                    {currentErrorStudent + 1 == errorStudents.length
                      ? "FINISH"
                      : "NEXT"}
                  </button>
                  <button className={styles.button} onClick={resetState}>
                    CANCEL
                  </button>
                </div>
              </div>
            )}
            {stepNumber === 3 && (
              <>
                <div className="row justify-content-center">
                  <div className="col-md-6 col-sm-12 m-4 text-center">
                    <h2>
                      Uploaded Documents{" "}
                      {uploadSuccess ? "Successfully" : "Failed"}!
                    </h2>
                    <p>
                      {uploadSuccess
                        ? `Data has been saved in the database. You can choose to
                      view all records, view the records you recently uploaded,
                      and upload data again.`
                        : `There was a problem uploading the files. Please try again or see the report below for more details.`}
                    </p>
                    <p>
                      <b>Total Success:</b> {uploadReport.successful}
                      <i className="bi bi-dot mx-3"></i>
                      <b>Duplicates:</b> {uploadReport.duplicate}
                      <i className="bi bi-dot mx-3"></i>
                      <b>Invalid Files:</b> {uploadReport.invalidFiles.length}
                      <i className="bi bi-dot mx-3"></i>
                      <b>Total Failed:</b> {uploadReport.failure}
                      <i className="bi bi-dot mx-3"></i>
                      <b>Total Files:</b> {uploadReport.total}
                    </p>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div
                    className={`col-sm-12 col-md-2 m-3 card text-center ${styles.card}`}
                  >
                    <div className="card-body d-flex flex-column justify-content-center">
                      <i className="bi bi-table fs-1"></i>
                      <Link
                        to="/view-records"
                        className="stretched-link text-dark text-decoration-none"
                      >
                        View All Records
                      </Link>
                    </div>
                  </div>
                  {uploadSuccess && (
                    <div
                      className={`col-sm-12 col-md-2 m-3 card text-center ${styles.card}`}
                    >
                      <div className="card-body d-flex flex-column justify-content-center">
                        <i className="bi bi-table fs-1"></i>
                        <Link
                          to={`/view-records?upload_id=${uploadId}`}
                          className="stretched-link text-dark text-decoration-none"
                        >
                          View Uploaded Records
                        </Link>
                      </div>
                    </div>
                  )}
                  <div
                    className={`col-sm-12 col-md-2 m-3 card text-center ${styles.card}`}
                  >
                    <div className="card-body d-flex flex-column justify-content-center">
                      <i className="bi bi-cloud-arrow-up fs-1 d-none d-md-block"></i>
                      <Link
                        to=""
                        className="stretched-link text-dark text-decoration-none"
                        onClick={resetState}
                      >
                        Upload Again
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
