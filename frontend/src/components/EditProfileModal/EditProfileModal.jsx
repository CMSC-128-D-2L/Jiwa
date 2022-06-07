import { createRef, useState } from "react";
import { toggleVisibility } from "../../utilities/toggleVisibility";
import { apiUrl } from "../../utilities/apiUrl";
import styles from "./EditProfileModal.module.css";

export const EditProfileModal = ({
  setIsOpen,
  firstName,
  middleName,
  lastName,
  email,
  userID,
  checker,
  recoveryQ1,
  recoverQ2,
  recoveryQ3,
  recoveryA1,
  recoveryA2,
  recoveryA3,
}) => {
  const [password, setCurrentPW] = useState("");
  const [checkPassword, setCheckPassword] = useState(true);
  const currentPasswordRef = createRef();
  const cpTogglerRef = createRef();

  const changePW = (e) => {
    setCurrentPW(e);
  };

  const handleEditInfo = (e) => {
    e.preventDefault();
    fetch(apiUrl("/user/" + userID), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        password: password,
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        email: email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setCheckPassword(true);

        if (data.message === "User successfully edited") {
          window.location.reload();
        } else if (data.message === "Wrong password") {
          setCheckPassword(false);
        }
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  };

  const handleRecoveryQA = (e) => {
    e.preventDefault();
    fetch(apiUrl("/user/" + userID), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        password: password,
        recoveryQA: [
          { question: recoveryQ1, answer: recoveryA1 },
          { question: recoverQ2, answer: recoveryA2 },
          { question: recoveryQ3, answer: recoveryA3 },
        ],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setCheckPassword(true);

        if (data.message === "User successfully edited") {
          window.location.reload();
        } else if (data.message === "Wrong password") {
          setCheckPassword(false);
        }
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  };

  return (
    <>
      <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
      <div className={styles.mainCentered}>
        <div className={styles.modal}>
          <button
            type="button"
            className={"btn-close " + styles.modalClose}
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={() => setIsOpen(false)}
          ></button>
          <div className={styles.saveHeader}>
            <h3 className={styles.saveHeading}>Save Changes</h3>
          </div>
          {/* <button
            className={styles.modalClose}
            aria-label="Close modal"
            onClick={() => setIsOpen(false)}
          >
            
            &times;
          </button> */}

          <p className="text-muted">
            Please input password to confirm changes.
          </p>
          <div className={"input-group " + styles.modalInputPass}>
            <input
              type="password"
              className={`form-control border-end-0 ${
                !checkPassword && "border-danger"
              }`}
              onChange={(e) => changePW(e.target.value)}
              ref={currentPasswordRef}
              required
            ></input>
            <span
              className={`input-group-text bg-white p-0 border-start-0 rounded-end ${
                !checkPassword && "border-danger"
              }`}
            >
              <div
                className="btn py-1 px-2"
                onClick={() => {
                  toggleVisibility(currentPasswordRef, cpTogglerRef);
                }}
              >
                <i className="bi bi-eye" ref={cpTogglerRef}></i>
              </div>
            </span>
            {!checkPassword && (
              <div className="invalid-feedback d-block">Wrong password</div>
            )}
          </div>
          <button
            type="submit"
            className={styles.modalSave}
            onClick={checker ? handleRecoveryQA : handleEditInfo}
          >
            SAVE
          </button>
        </div>
      </div>
    </>
  );
};
