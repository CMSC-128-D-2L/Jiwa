import styles from "./Modal.module.css";
import { apiUrl } from "../../utilities/apiUrl";
import { useState } from "react";

export const Modal = ({
  setShowModal,
  firstName,
  lastName,
  Course,
  StudNo,
  sem,
  GWA,
  totalUnits,
  totalRunningSum,
  reqUnits,
  notes,
  studID,
}) => {
  const [description, setDescription] = useState("");
  const [errorDescription, setErrorDescription] = useState("");
  const [invalidRes, setInvalidRes] = useState(true);
  const [validDescription, setValidDescription] = useState(true);
  const [charCount, setCharCount] = useState(0);

  const NewStudentDetails = [
    firstName,
    lastName,
    Course,
    StudNo,
    sem,
    GWA,
    totalUnits,
    totalRunningSum,
    reqUnits,
    notes,
  ];

  const student = {
    firstName: NewStudentDetails[0],
    lastName: NewStudentDetails[1],
    Course: NewStudentDetails[2],
    StudNo: NewStudentDetails[3],
    sem: NewStudentDetails[4],
    GWA: NewStudentDetails[5],
    totalUnits: NewStudentDetails[6],
    totalRunningSum: NewStudentDetails[7],
    reqUnits: NewStudentDetails[8],
    notes: NewStudentDetails[9],
  };

  let payload = new FormData();
  payload.append("NewStudentDetails", JSON.stringify(student));
  payload.append("description", JSON.stringify(description));

  const handleSubmitChanges = () => {
    fetch(apiUrl("/student/" + studID), {
      method: "PUT",
      credentials: "include",
      body: payload,
    })
      .then((response) => response.json())
      .then((data) => {
        const strTry = " Please refresh the page and try again.";
        if (data.message === "Unauthorized access!") {
          //Server side error when validating the token
          setInvalidRes(false);
          setErrorDescription("Error in validating token." + strTry);
        } else if (data.message === "Unspecified student ID!") {
          //Student ID is missing.
          setInvalidRes(false);
          setErrorDescription("Missing student ID." + strTry);
        } else if (
          data.message === "Missing data!" ||
          data.message === "Missing student ID and new student details!"
        ) {
          //{ NewStudentDetails } || Both student ID and { NewStudentDetails } are missing.
          setInvalidRes(false);
          setErrorDescription("Missing student data!" + strTry);
        } else if (data.message === "Student does not exist!") {
          //Student not found on the database.
          setInvalidRes(false);
          setErrorDescription("Student does not exist!" + strTry);
        } else {
          console.log("Sucess: " + data);
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  };

  const checkValidDescription = (e) => {
    if (e.indexOf("'") >= 0 || e.indexOf('"') >= 0) {
      setErrorDescription(
        "Please do not include apostrophes or double quotes in the description."
      );
      setValidDescription(false);
    } else if (charCount >= 180) {
      setErrorDescription(
        "Character limit reached. You can't use more than 180 characters."
      );
      setValidDescription(false);
    } else {
      setValidDescription(true);
    }
  };

  const updateDescription = (e) => {
    setDescription(e);
  };

  return (
    <div>
      <div className={styles.modalDarkBG} onClick={() => setShowModal(false)} />
      <div className={styles.modalCentered}>
        <div className={styles.modalMain}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalHeading}>Documentation</h3>
          </div>
          <button
            className={styles.modalClose}
            aria-label="Close modal"
            onClick={() => setShowModal(false)}
          >
            &times;
          </button>
          <div>
            <p className="mb-0">
              Write a brief description about the changes you have made. This
              will go into the edit history.
            </p>
          </div>
          <div className="form-outline mb-1">
            {charCount <= 180 ? (
              <small className={"mx-1 my-0 " + styles.charCount}>
                {charCount}/180
              </small>
            ) : (
              <small className={"text-danger mx-1 my-0 " + styles.charCount}>
                {charCount}/180
              </small>
            )}
            <textarea
              className={"form control " + styles.modalTxtArea}
              onChange={(e) => {
                updateDescription(e.target.value);
                checkValidDescription(e.target.value);
                setCharCount(e.target.value.length);
              }}
              rows="10"
            ></textarea>
          </div>
          {!invalidRes && (
            <div className="invalid-feedback d-block mb-3">
              {errorDescription}
            </div>
          )}
          {!validDescription && (
            <div className="invalid-feedback d-block mb-3">
              {errorDescription}
            </div>
          )}
          <button
            type="submit"
            className={styles.modalSave}
            onClick={handleSubmitChanges}
            disabled={!description || !validDescription}
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};
