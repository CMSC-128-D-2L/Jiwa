import styles from "./StudentRecord.module.css";
import { StudentRecordTable } from "../../components/StudentRecordTable";
import { SummaryTable } from "../../components/SummaryTable";
import { Modal } from "../../components/Modal/Modal";
import { CancelModal } from "../../components/CancelModal/CancelModal";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiUrl } from "../../utilities/apiUrl";

export const StudentRecord = () => {
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

  const [editFName, setEditFName] = useState(null);
  const [editLName, setEditLName] = useState(null);
  const [editDegree, setEditDegree] = useState(null);
  const [editStudentNo, setEditStudentNo] = useState(null);

  const [editStudentData, setEditStudentData] = useState(null);
  const [GWA, setGWA] = useState(null);
  const [totalUnits, setTotalUnits] = useState(null);
  const [totalRunningSum, setTotalRunningSum] = useState(null);
  const [reqUnits, setReqUnits] = useState(null);
  const [notes, setNotes] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editChecker, setEditChecker] = useState(true);
  const [initialData, setInitialData] = useState(null);

  const [showCancelModal, setShowCancelModal] = useState(false);

  const [editErrorPresent, setEditErrorPresent] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);
  const [uploader, setUploader] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  useEffect(() => {
    fetch(apiUrl("/student/" + id), {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setEditFName(data["firstName"]);
        setEditLName(data["lastName"]);
        setEditDegree(data["Course"]);
        setEditStudentNo(data["StudNo"]);
        setEditStudentData(data["sem"]);
        setGWA(data["GWA"]);
        setTotalUnits(data["totalUnits"]);
        setTotalRunningSum(data["totalRunningSum"]);
        setReqUnits(data["reqUnits"]);
        setNotes(data["notes"]);
        setInitialData(structuredClone(data));
        setUploader(data["uploaderId"]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    fetch(apiUrl("/auth/"), {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setCurrentUser(data.User._id);
        if (data.User.role === "admin") {
          setIsAdmin(true);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const cancelChanges = () => {
    setEditFName(initialData["firstName"]);
    setEditLName(initialData["lastName"]);
    setEditDegree(initialData["Course"]);
    setEditStudentNo(initialData["StudNo"]);
    setEditStudentData(structuredClone(initialData["sem"]));
    setGWA(initialData["GWA"]);
    setTotalUnits(initialData["totalUnits"]);
    setTotalRunningSum(initialData["totalRunningSum"]);
    setReqUnits(initialData["reqUnits"]);
    setNotes(initialData["notes"]);
    setEditChecker(true);
    setEditErrorPresent([]);
    setShowCancelModal(false);
  };

  const handleReqUnits = (e) => {
    setReqUnits(e.target.value);
  };

  useEffect(() => {
    if (showModal || showCancelModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showModal, showCancelModal]);

  return (
    notes && (
      <div>
        {showModal && (
          <Modal
            setShowModal={setShowModal}
            firstName={editFName}
            lastName={editLName}
            Course={editDegree}
            StudNo={editStudentNo}
            sem={editStudentData}
            GWA={GWA}
            totalUnits={totalUnits}
            totalRunningSum={totalRunningSum}
            reqUnits={reqUnits}
            notes={notes}
            studID={id}
          />
        )}
        {showCancelModal && (
          <CancelModal
            setShowCancelModal={setShowCancelModal}
            cancelChanges={cancelChanges}
            pageChecker={false}
          />
        )}
        <div className={styles.studentRecord}>
          <div className="row">
            <div className="d-flex bd-highlight">
              {editChecker ? (
                <div
                  className={styles.return + " px-2 flex-grow-1 bd-highlight"}
                >
                  <i
                    onClick={() => navigate("/view-records")}
                    className={
                      styles.returnIcon + " bi bi-arrow-left " + styles.noPrint
                    }
                  >
                    <span className={styles.returnText}>RETURN TO RECORDS</span>
                  </i>
                </div>
              ) : (
                <div
                  className={styles.return + "px-2 flex-grow-1 bd-highlight"}
                ></div>
              )}
              <div className="px-2 bd-highlight">
                {editChecker ? (
                  (uploader === currentUser || isAdmin) && (
                    <button
                      className={styles.editBtn + " " + styles.noPrint}
                      type="button"
                      onClick={() => setEditChecker(false)}
                    >
                      EDIT
                    </button>
                  )
                ) : (
                  <button
                    className={styles.cancelBtn + " " + styles.noPrint}
                    type="button"
                    onClick={() => setShowCancelModal(true)}
                  >
                    CANCEL
                  </button>
                )}
              </div>
              <div className="px-2 bd-highlight">
                {editChecker ? (
                  <button
                    className={styles.printBtn + " " + styles.noPrint}
                    type="button"
                    onClick={() => window.print()}
                  >
                    PRINT
                  </button>
                ) : (
                  <div>
                    <button
                      disabled={
                        editErrorPresent.length > 0 || totalUnits < reqUnits
                      }
                      className={styles.printBtn + " " + styles.noPrint}
                      type="button"
                      onClick={() => setShowModal(true)}
                    >
                      SAVE
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <StudentRecordTable
              studentData={editStudentData}
              currentFName={editFName}
              currentLName={editLName}
              currentDegree={editDegree}
              currentStudentNo={editStudentNo}
              currentStudentData={editStudentData}
              setCurrentFName={setEditFName}
              setCurrentLName={setEditLName}
              setCurrentDegree={setEditDegree}
              setCurrentStudentNo={setEditStudentNo}
              setCurrentStudentData={setEditStudentData}
              setGWA={setGWA}
              setTotalUnits={setTotalUnits}
              setTotalRunningSum={setTotalRunningSum}
              column={column}
              editChecker={editChecker}
              gradesArray={gradesArray}
              unitsArray={unitsArray}
              editErrorPresent={editErrorPresent}
              setEditErrorPresent={setEditErrorPresent}
            />
          </div>
          <SummaryTable
            GWA={GWA}
            totalUnits={totalUnits}
            totalRunningSum={totalRunningSum}
            reqUnits={reqUnits}
            notes={notes}
            column={summaryColumn}
            handleReqUnits={handleReqUnits}
          />
        </div>
      </div>
    )
  );
};
