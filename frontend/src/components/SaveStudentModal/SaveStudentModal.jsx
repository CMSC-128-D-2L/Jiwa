import styles from "./SaveStudentModal.module.css";
import { useNavigate } from "react-router-dom";

export const SaveStudentModal = ({
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
}) => {
  const navigate = useNavigate();
  const newStudent = {
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
  };

  return (
    <div>
      <div className={styles.modalDarkBG} onClick={() => setShowModal(false)} />
      <div className={styles.modalCentered}>
        <div className={styles.modalMain}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalHeading}>Confirmation</h3>
          </div>
          <button
            className={styles.modalClose}
            aria-label="Close modal"
            onClick={() => setShowModal(false)}
          >
            &times;
          </button>
          <div>
            <p>Click save to create a new student record.</p>
          </div>
          <button
            type="submit"
            className={styles.modalSave}
            onClick={() => {
              navigate("/upload-docs", {
                state: newStudent,
              });
            }}
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};
