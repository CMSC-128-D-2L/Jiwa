import styles from "./StudentRecordTable.module.css";
import { StudentTableRow } from "../StudentTableRow";

export const StudentRecordTable = ({
  currentFName,
  currentLName,
  currentDegree,
  currentStudentNo,
  currentStudentData,
  setCurrentFName,
  setCurrentLName,
  setCurrentDegree,
  setCurrentStudentNo,
  setCurrentStudentData,
  setGWA,
  setTotalUnits,
  setTotalRunningSum,
  column,
  editChecker,
  gradesArray,
  unitsArray,
  editErrorPresent,
  setEditErrorPresent,
}) => {
  const TableHeadItem = ({ item }) => <th className="px-lg-5">{item.text}</th>;

  // Computes the total units of each sem
  const computeSemTotalUnits = (semIndex, dataIndex) => {
    let totalUnits = 0;
    let units, grade;
    let newStudentData = [...currentStudentData];

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
    setCurrentStudentData(newStudentData);
  };

  // Computes the running sum of each sem
  const computeSemRunningSum = () => {
    let runningSum = 0;
    let newStudentData = [...currentStudentData];

    let noSems = newStudentData.length;

    for (let i = 0; i < noSems; i++) {
      let noCourses = newStudentData[i]["courseDetails"].length;
      for (let j = 0; j < noCourses; j++) {
        runningSum += newStudentData[i]["courseDetails"][j].Computed;
      }
      newStudentData[i]["runningSum"] = runningSum;
      setCurrentStudentData(newStudentData);
    }
  };

  // Computes the weight of each course. If there is an invalid value, returns NaN
  const computeWeight = (semIndex, dataIndex) => {
    let computed;
    let newStudentData4 = [...currentStudentData];

    let course = newStudentData4[semIndex]["courseDetails"][dataIndex].CourseID;
    let units = newStudentData4[semIndex]["courseDetails"][dataIndex].Units;
    let grade = newStudentData4[semIndex]["courseDetails"][dataIndex].Grade;

    if (
      grade == "P" ||
      grade == "DRP" ||
      grade == "S" ||
      grade == "U" ||
      grade == "INC" ||
      grade == "DFG"
    ) {
      computed = 0;
    } else {
      computed = grade;
    }

    if (course.includes("200")) {
      computed *= 6;
    } else {
      computed *= units;
    }

    newStudentData4[semIndex]["courseDetails"][dataIndex].Computed = computed;

    setCurrentStudentData(newStudentData4);
    computeSemTotalUnits(semIndex, dataIndex);
    computeSemRunningSum();
  };

  const computeGWA = () => {
    let newStudentData = [...currentStudentData];
    let noOfSems = newStudentData.length;
    let totalUnits = 0;

    for (let i = 0; i < noOfSems; i++) {
      totalUnits += parseInt(newStudentData[i]["units"]);
    }
    let totalRunningSum = newStudentData[noOfSems - 1]["runningSum"];

    let GWA = totalRunningSum / totalUnits;
    setGWA(GWA);
  };

  const computeTotalUnits = () => {
    let newStudentData = [...currentStudentData];
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
  };

  const computeTotalRunningSum = () => {
    let newStudentData = [...currentStudentData];
    let noOfSems = newStudentData.length;
    let totalRunningSum = newStudentData[noOfSems - 1]["runningSum"];
    setTotalRunningSum(totalRunningSum);
  };

  const updateNUnits = (semIndex, dataIndex, uniqueKey) => (e) => {
    let count;
    let newStudentData2 = [...currentStudentData];
    newStudentData2[semIndex]["courseDetails"][dataIndex].Units =
      e.target.value;
    setCurrentStudentData(newStudentData2);

    if (
      unitsArray.includes(
        newStudentData2[semIndex]["courseDetails"][dataIndex].Units
      )
    ) {
      if (editErrorPresent.length > 0) {
        if (editErrorPresent.includes(uniqueKey)) {
          for (let i = 0; i < editErrorPresent.length; i++) {
            if (editErrorPresent[i] == uniqueKey) count = i;
          }
          editErrorPresent.splice(count, 1);
          setEditErrorPresent(editErrorPresent);
        }
      }

      computeWeight(semIndex, dataIndex);
      computeTotalUnits();
      computeTotalRunningSum();
      computeGWA();
    } else {
      if (!editErrorPresent.includes(uniqueKey)) {
        editErrorPresent.push(uniqueKey);
        setEditErrorPresent(editErrorPresent);
      }
    }
  };

  const updateGrade = (semIndex, dataIndex, uniqueKey) => (e) => {
    let count;
    let newStudentData3 = [...currentStudentData];
    newStudentData3[semIndex]["courseDetails"][dataIndex].Grade =
      e.target.value;
    setCurrentStudentData(newStudentData3);

    if (
      gradesArray.includes(
        newStudentData3[semIndex]["courseDetails"][dataIndex].Grade
      )
    ) {
      if (editErrorPresent.length > 0) {
        if (editErrorPresent.includes(uniqueKey)) {
          for (let i = 0; i < editErrorPresent.length; i++) {
            if (editErrorPresent[i] == uniqueKey) count = i;
          }
          editErrorPresent.splice(count, 1);
          setEditErrorPresent(editErrorPresent);
        }
      }

      computeWeight(semIndex, dataIndex);
      computeTotalRunningSum();
      computeGWA();
    } else {
      if (!editErrorPresent.includes(uniqueKey)) {
        editErrorPresent.push(uniqueKey);
        setEditErrorPresent(editErrorPresent);
      }
    }
  };

  const updateLName = (e) => {
    setCurrentLName(e.target.value);
  };

  const updateFName = (e) => {
    setCurrentFName(e.target.value);
  };

  const updateDegree = (e) => {
    setCurrentDegree(e.target.value);
  };

  const updateStudentNo = (e) => {
    setCurrentStudentNo(e.target.value);
  };

  return (
    <div>
      <p className={styles.forPrint}>
        <strong>
          {currentLName}, {currentFName} &ensp; &ensp; {currentDegree} &ensp;
          &ensp; {currentStudentNo}
        </strong>
      </p>
      <table
        className={"table borderRadius " + styles.table}
        cellSpacing="0"
        width="100%"
      >
        <thead>
          <tr>
            <th
              colSpan="5"
              className={styles.studentInfo + " m-2 py-lg-4 px-lg-4"}
            >
              {editChecker ? (
                <div className="row">
                  <div className="col-auto mx-lg-3">
                    <p className={"secondaryText " + styles.label}>Last Name</p>
                    <h3 className={styles.info}> {currentLName}</h3>
                  </div>
                  <div className="col-auto mx-lg-3">
                    <p className={"secondaryText " + styles.label}>
                      First Name
                    </p>
                    <h3 className={styles.info}> {currentFName}</h3>
                  </div>
                  <div className="col-auto mx-lg-3">
                    <p className={"secondaryText " + styles.label}>
                      Degree Program
                    </p>
                    <h3 className={styles.info}> {currentDegree}</h3>
                  </div>
                  <div className="col-auto mx-lg-3">
                    <p className={"secondaryText " + styles.label}>
                      Student No.
                    </p>
                    <h3 className={styles.info}> {currentStudentNo}</h3>
                  </div>
                </div>
              ) : (
                <div className="row">
                  <div className="col-auto mx-lg-3">
                    <p className={styles.label}>Last Name</p>
                    <h3>
                      <input
                        className={styles.editStudentInfo}
                        type="text"
                        value={currentLName}
                        onChange={(e) => updateLName(e)}
                      ></input>
                    </h3>
                  </div>
                  <div className="col-auto mx-lg-3">
                    <p className={styles.label}>First Name</p>
                    <h3>
                      <input
                        className={styles.editStudentInfo}
                        type="text"
                        value={currentFName}
                        onChange={(e) => updateFName(e)}
                      ></input>
                    </h3>
                  </div>
                  <div className="col-auto mx-lg-3">
                    <p className={styles.label}>Degree Program</p>
                    <h3>
                      <input
                        className={styles.editStudentInfo}
                        type="text"
                        value={currentDegree}
                        onChange={(e) => updateDegree(e)}
                      ></input>
                    </h3>
                  </div>
                  <div className="col-auto mx-lg-3">
                    <p className={styles.label}>Student No.</p>
                    <h3>
                      <input
                        className={styles.editStudentInfo}
                        type="text"
                        value={currentStudentNo}
                        onChange={(e) => updateStudentNo(e)}
                      ></input>
                    </h3>
                  </div>
                </div>
              )}
            </th>
          </tr>
        </thead>
        <thead>
          <tr>
            {column.map((item, index) => (
              <TableHeadItem key={index} item={item} />
            ))}
          </tr>
        </thead>
        {editChecker ? (
          <tbody>
            {currentStudentData.map((item, index) => (
              <StudentTableRow
                item={item}
                key={index}
                column={column}
                index={index}
              />
            ))}
          </tbody>
        ) : (
          <tbody>
            {currentStudentData.map((sem, semIndex) => {
              let sems = [];
              let nCourses = sem["courseDetails"].length;
              let uniqueKey = 0;

              for (let i = 0; i < nCourses; i++) {
                let rows = [];

                rows.push(
                  <td key={uniqueKey} className={"px-lg-5 " + styles.tableRow}>
                    {sem["courseDetails"][i].CourseID}
                  </td>
                );
                uniqueKey++;
                rows.push(
                  <td key={uniqueKey} className={"px-lg-5 " + styles.tableRow}>
                    {sem["courseDetails"][i].CourseID.includes("AWOL") ||
                    sem["courseDetails"][i].CourseID.includes("LOA") ? (
                      sem["courseDetails"][i].Grade
                    ) : (
                      <input
                        className={
                          gradesArray.includes(sem["courseDetails"][i].Grade)
                            ? styles.editFieldNumber
                            : styles.editFieldNumberError
                        }
                        type="text"
                        value={sem["courseDetails"][i].Grade}
                        onChange={updateGrade(semIndex, i, uniqueKey)}
                      ></input>
                    )}
                  </td>
                );
                uniqueKey++;

                rows.push(
                  <td key={uniqueKey} className={"px-lg-5 " + styles.tableRow}>
                    {sem["courseDetails"][i].CourseID.includes("AWOL") ||
                    sem["courseDetails"][i].CourseID.includes("LOA") ||
                    sem["courseDetails"][i].CourseID.includes("NSTP") ||
                    sem["courseDetails"][i].CourseID.includes("PE") ||
                    sem["courseDetails"][i].CourseID.includes("HK") ? (
                      sem["courseDetails"][i].Units
                    ) : (
                      <input
                        className={
                          unitsArray.includes(sem["courseDetails"][i].Units)
                            ? styles.editFieldNumber
                            : styles.editFieldNumberError
                        }
                        type="text"
                        value={sem["courseDetails"][i].Units}
                        onChange={updateNUnits(semIndex, i, uniqueKey)}
                      ></input>
                    )}
                  </td>
                );
                uniqueKey++;

                rows.push(
                  <td key={uniqueKey} className={"px-lg-5 " + styles.tableRow}>
                    {sem["courseDetails"][i].Computed}
                  </td>
                );
                uniqueKey++;

                if (i === 0) {
                  rows.push(
                    <td
                      key={uniqueKey}
                      className={styles.tableRow + " px-lg-5 " + styles.termCol}
                      rowSpan={`${nCourses}`}
                    >
                      <strong>Date:</strong> {sem["date"]} <br />
                      <strong>Total No. of Units:</strong> {sem["units"]} <br />
                      <strong>Running Sum:</strong> {sem["runningSum"]}
                    </td>
                  );
                }

                sems.push(
                  <tr key={uniqueKey}>{rows.map((tdValue) => tdValue)}</tr>
                );
              }
              return sems;
            })}
          </tbody>
        )}
      </table>
    </div>
  );
};
