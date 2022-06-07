import styles from "./CreateStudentTable.module.css";
import { useEffect } from "react";

export const CreateStudentTable = ({
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
  column,
  gradesArray,
  unitsArray,
  editErrorPresent,
  setEditErrorPresent,
  computeSemTotalUnits,
  computeSemRunningSum,
  computeTotalUnits,
  computeTotalRunningSum,
  computeGWA,
  deleteSem,
}) => {
  const TableHeadItem = ({ item }) => <th className="px-lg-5">{item.text}</th>;
  const forLoopIfEmpty = [1, 2, 3, 4, 5];

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

  const handleDelete = (semIndex, dataIndex) => {
    let newStudentData5 = [...currentStudentData];
    newStudentData5[semIndex]["courseDetails"].splice(dataIndex, 1);

    setCurrentStudentData(newStudentData5);

    computeSemTotalUnits(semIndex, dataIndex);
    computeSemRunningSum();
    computeTotalUnits();
    computeTotalRunningSum();
    computeGWA();
    deleteSem(semIndex);
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
        <tbody>
          {currentStudentData.length > 0 ? (
            currentStudentData.map((sem, semIndex) => {
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
                  <td key={uniqueKey} className={"ps-lg-5 " + styles.tableRow}>
                    <div className="d-flex justify-content-between align-items-center">
                      {sem["courseDetails"][i].Computed}
                      <button
                        className="btn bi bi-trash text-danger rounded-pill"
                        onClick={() => {
                          handleDelete(semIndex, i);
                        }}
                      ></button>
                    </div>
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
            })
          ) : (
            <tr>
              {forLoopIfEmpty.map((value) => {
                return (
                  <td key={value} className={"px-lg-5 py-lg-2 "}>
                    ---
                  </td>
                );
              })}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
