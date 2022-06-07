import styles from "./CreateStudent.module.css";
import { CreateStudentTable } from "../../components/CreateStudentTable";
import { CreateStudentSummary } from "../../components/CreateStudentSummary";
import { AddCourseFields } from "../../components/AddCourseFields";
import { SaveStudentModal } from "../../components/SaveStudentModal/SaveStudentModal";
import { CancelModal } from "../../components/CancelModal/CancelModal";
import { useState, useEffect } from "react";

export const CreateStudent = () => {
  const column = [
    { text: "Course Code", dataField: "CourseID" },
    { text: "Grade", dataField: "Grade" },
    { text: "No. of Units", dataField: "Units" },
    { text: "Computed", dataField: "Computed" },
    { text: "Term", dataField: "" },
  ];

  const summaryColumn = [
    { text: "GWA", dataField: "GWA" },
    { text: "Total No. of Units", dataField: "totalUnits" },
    { text: "Total Running Sum", dataField: "totalRunningSum" },
    { text: "Required No. of Units", dataField: "reqUnits" },
  ];

  const gradesArray = [
    "1",
    "1.25",
    "1.5",
    "1.75",
    "2",
    "2.25",
    "2.5",
    "2.75",
    "3",
    "5",
    "S",
    "P",
    "DRP",
    "U",
    "INC",
    "DFG",
  ];

  const unitsArray = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "(1)6",
    "(2)6",
    "(3)6",
    "(4)6",
    "(5)6",
    "6",
  ];

  const [editFName, setEditFName] = useState("");
  const [editLName, setEditLName] = useState("");
  const [editDegree, setEditDegree] = useState("");
  const [editStudentNo, setEditStudentNo] = useState("");

  const [studentData, setStudentData] = useState([]);
  const [GWA, setGWA] = useState(null);
  const [totalUnits, setTotalUnits] = useState(null);
  const [totalRunningSum, setTotalRunningSum] = useState(null);
  const [reqUnits, setReqUnits] = useState(0);
  const [notes, setNotes] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editChecker, setEditChecker] = useState(true);

  const [showCancelModal, setShowCancelModal] = useState(false);

  const [editErrorPresent, setEditErrorPresent] = useState([]);
  const [inputErrorPresent, setInputErrorPresent] = useState(false);

  const [inputCourseCode, setInputCourseCode] = useState("");
  const [inputUnits, setInputUnits] = useState("");
  const [inputGrade, setInputGrade] = useState("");
  const [inputWeight, setInputWeight] = useState("");
  const [inputTerm, setInputTerm] = useState("");

  // Computes the total units of each sem
  const computeSemTotalUnits = (semIndex) => {
    let totalUnits = 0;
    let units, grade;
    let newStudentData = [...studentData];

    let course;
    let noCourses = newStudentData[semIndex]["courseDetails"].length;

    for (let i = 0; i < noCourses; i++) {
      course = newStudentData[semIndex]["courseDetails"][i].CourseID;
      units = newStudentData[semIndex]["courseDetails"][i].Units;
      grade = newStudentData[semIndex]["courseDetails"][i].Grade;

      if (
        grade == "DRP" ||
        grade == "S" ||
        grade == "U" ||
        grade == "INC" ||
        grade == "DFG"
      ) {
        totalUnits += 0;
      } else if (course.includes("200") && units.charAt(0) == "(") {
        let char = units.charAt(1);
        totalUnits += parseInt(char, 10);
      } else {
        totalUnits += parseInt(units, 10);
      }
    }

    newStudentData[semIndex]["units"] = totalUnits.toString();
    setStudentData(newStudentData);

    computeTotalUnits();
  };

  // Computes the running sum of each sem
  const computeSemRunningSum = () => {
    let runningSum = 0;
    let newStudentData = [...studentData];

    let noSems = newStudentData.length;

    for (let i = 0; i < noSems; i++) {
      let noCourses = newStudentData[i]["courseDetails"].length;
      for (let j = 0; j < noCourses; j++) {
        runningSum += newStudentData[i]["courseDetails"][j].Computed;
      }
      newStudentData[i]["runningSum"] = runningSum;
      setStudentData(newStudentData);
    }

    computeTotalRunningSum();
  };

  // Computes the total units in the summary table (i.e., total units of all courses)
  const computeTotalUnits = () => {
    if (studentData.length > 0) {
      let newStudentData = [...studentData];
      let noOfSems = newStudentData.length;
      let units;
      let totalUnits = 0;

      for (let i = 0; i < noOfSems; i++) {
        units = parseInt(newStudentData[i]["units"]);

        if (units == "") {
          units = 0;
        }

        totalUnits += units;
      }

      setTotalUnits(totalUnits);
    }
  };

  // Computes the total running sum in the summary table (i.e., running sum of all courses)
  const computeTotalRunningSum = () => {
    if (studentData.length > 0) {
      let newStudentData = [...studentData];
      let noOfSems = newStudentData.length;
      let totalRunningSum = newStudentData[noOfSems - 1]["runningSum"];
      setTotalRunningSum(totalRunningSum);
    }

    computeGWA();
  };

  // Computes the GWA in the summary table
  const computeGWA = () => {
    if (studentData.length > 0) {
      let newStudentData = [...studentData];
      let noOfSems = newStudentData.length;
      let totalUnits = 0;

      for (let i = 0; i < noOfSems; i++) {
        totalUnits += parseInt(newStudentData[i]["units"]);
      }
      let totalRunningSum = newStudentData[noOfSems - 1]["runningSum"];

      let GWA = totalRunningSum / totalUnits;
      setGWA(GWA);
    }
  };

  const emptyInputFields = () => {
    setInputCourseCode("");
    setInputUnits("");
    setInputGrade("");
    setInputWeight("");
  };

  const addRow = () => {
    const newRow = {
      CourseID: inputCourseCode,
      Grade: inputGrade,
      Units: inputUnits,
      Computed: parseFloat(inputWeight),
    };

    const newSem = {
      date: inputTerm,
      courseDetails: [newRow],
      units: inputUnits,
      runningSum: null,
    };

    for (let i = 0; i < studentData.length; i++) {
      if (studentData[i].date === inputTerm) {
        studentData[i].courseDetails.push(newRow);
        setStudentData([studentData]);
        computeSemTotalUnits(i);
        computeSemRunningSum();
        emptyInputFields();
        return;
      }
    }

    setStudentData(studentData.push(newSem));
    computeSemRunningSum();
    computeTotalUnits();
    emptyInputFields();
  };

  const handleInputCourseCode = (e) => {
    setInputCourseCode(e.target.value);
  };

  const handleInputUnits = (e) => {
    setInputUnits(e.target.value);
  };

  const handleInputGrade = (e) => {
    setInputGrade(e.target.value);
  };

  const handleInputWeight = (e) => {
    setInputWeight(e.target.value);
  };

  const handleInputTerm = (e) => {
    setInputTerm(e.target.value);
  };

  const handleReqUnits = (e) => {
    setReqUnits(e.target.value);
  };

  const deleteSem = (semIndex) => {
    let newStudentData = [...studentData];

    if (newStudentData[semIndex]["courseDetails"].length == 0) {
      newStudentData.splice(semIndex, 1);
      setStudentData(newStudentData);
    }
  };

  const cancelChanges = () => {
    setEditFName(initialData["firstName"]);
    setEditLName(initialData["lastName"]);
    setEditDegree(initialData["Course"]);
    setEditStudentNo(initialData["StudNo"]);
    setStudentData(structuredClone(initialData["sem"]));
    setGWA(initialData["GWA"]);
    setTotalUnits(initialData["totalUnits"]);
    setTotalRunningSum(initialData["totalRunningSum"]);
    setReqUnits(initialData["reqUnits"]);
    setNotes(initialData[""]);
    setEditChecker(true);
    setEditErrorPresent([]);
    setShowCancelModal(false);
  };

  useEffect(() => {
    if (showModal || showCancelModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showModal, showCancelModal]);

  useEffect(() => {
    if (
      inputCourseCode &&
      unitsArray.includes(inputUnits) &&
      gradesArray.includes(inputGrade) &&
      inputWeight &&
      inputTerm
    ) {
      setInputErrorPresent(false);
    } else {
      setInputErrorPresent(true);
    }
  });

  return (
    <div>
      {showModal && (
        <SaveStudentModal
          setShowModal={setShowModal}
          firstName={editFName}
          lastName={editLName}
          Course={editDegree}
          StudNo={editStudentNo}
          sem={studentData}
          GWA={GWA}
          totalUnits={totalUnits}
          totalRunningSum={totalRunningSum}
          reqUnits={reqUnits}
          notes={notes}
        />
      )}
      {showCancelModal && (
        <CancelModal
          setShowCancelModal={setShowCancelModal}
          cancelChanges={cancelChanges}
          pageChecker={true}
        />
      )}

      <AddCourseFields
        handleInputCourseCode={handleInputCourseCode}
        inputCourseCode={inputCourseCode}
        handleInputUnits={handleInputUnits}
        inputUnits={inputUnits}
        handleInputGrade={handleInputGrade}
        inputGrade={inputGrade}
        handleInputWeight={handleInputWeight}
        inputWeight={inputWeight}
        handleInputTerm={handleInputTerm}
        inputTerm={inputTerm}
        addRow={addRow}
        inputErrorPresent={inputErrorPresent}
        unitsArray={unitsArray}
        gradesArray={gradesArray}
      />

      <div className={styles.studentRecord}>
        <div className="row">
          <div className="d-flex bd-highlight">
            <div
              className={styles.return + "px-2 flex-grow-1 bd-highlight"}
            ></div>
            <div className="px-2 bd-highlight">
              <button
                className={styles.cancelBtn + " " + styles.noPrint}
                type="button"
                onClick={() => setShowCancelModal(true)}
              >
                CANCEL
              </button>
            </div>
            <div className="px-2 bd-highlight">
              <button
                disabled={
                  editErrorPresent.length > 0 ||
                  studentData.length < 1 ||
                  !editFName ||
                  !editLName ||
                  !editDegree ||
                  !editStudentNo ||
                  !reqUnits
                }
                className={styles.printBtn + " " + styles.noPrint}
                type="button"
                onClick={() => setShowModal(true)}
              >
                SAVE
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <CreateStudentTable
            currentFName={editFName}
            currentLName={editLName}
            currentDegree={editDegree}
            currentStudentNo={editStudentNo}
            currentStudentData={studentData}
            setCurrentFName={setEditFName}
            setCurrentLName={setEditLName}
            setCurrentDegree={setEditDegree}
            setCurrentStudentNo={setEditStudentNo}
            setCurrentStudentData={setStudentData}
            column={column}
            gradesArray={gradesArray}
            unitsArray={unitsArray}
            editErrorPresent={editErrorPresent}
            setEditErrorPresent={setEditErrorPresent}
            computeSemTotalUnits={computeSemTotalUnits}
            computeSemRunningSum={computeSemRunningSum}
            computeTotalUnits={computeTotalUnits}
            computeTotalRunningSum={computeTotalRunningSum}
            computeGWA={computeGWA}
            deleteSem={deleteSem}
          />
        </div>
        <CreateStudentSummary
          GWA={GWA}
          totalUnits={totalUnits}
          totalRunningSum={totalRunningSum}
          reqUnits={reqUnits}
          notes={notes}
          setNotes={setNotes}
          column={summaryColumn}
          studentData={studentData}
          handleReqUnits={handleReqUnits}
        />
      </div>
    </div>
  );
};
