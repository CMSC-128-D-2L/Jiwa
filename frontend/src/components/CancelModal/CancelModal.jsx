import styles from "./CancelModal.module.css";
import { useNavigate } from "react-router-dom";

export const CancelModal = ({
  setShowCancelModal,
  cancelChanges,
  pageChecker,
}) => {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  return (
    <div>
      <div
        className={styles.modalDarkBG}
        onClick={() => setShowCancelModal(false)}
      />
      <div className={styles.modalCentered}>
        <div className={styles.modalMain}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalHeading}>Confirmation</h3>
          </div>
          <button
            className={styles.modalClose}
            aria-label="Close cancel modal"
            onClick={() => setShowCancelModal(false)}
          >
            &times;
          </button>
          <div>
            {pageChecker ? (
              <p>
                You&apos;re about to cancel creating a student record. Are you
                sure you want to proceed? You will be redirected back to the
                upload documents page.
              </p>
            ) : (
              <p>
                You&apos;re about to cancel the information you have edited. Are
                you sure you want to proceed?
              </p>
            )}
          </div>
          {pageChecker ? (
            <button
              className={styles.modalSave}
              onClick={() => navigate("/upload-docs")}
            >
              Yes, I&apos;m sure.
            </button>
          ) : (
            <button
              type="submit"
              className={styles.modalSave}
              onClick={cancelChanges}
            >
              Yes, I&apos;m sure.
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
