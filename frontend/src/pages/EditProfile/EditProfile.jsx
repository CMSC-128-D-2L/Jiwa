import styles from "./EditProfile.module.css";
import { createRef, useState, useEffect } from "react";
import { PasswordReqs } from "../../components/PasswordReqs";
import { EditProfileModal } from "../../components/EditProfileModal/EditProfileModal";
import { SecurityQuestions } from "../../components/SecurityQuestions";
import { toggleVisibility } from "../../utilities/toggleVisibility";
import {
  checkPassword,
  checkPasswordEquality,
  checkName,
  checkMiddleName,
  toTitleCase,
} from "../../utilities/inputVerification";
import { apiUrl } from "../../utilities/apiUrl";

export const EditProfile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [firstName, setFName] = useState("");
  const [middleName, setMName] = useState("");
  const [lastName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [userID, setUserID] = useState(null);
  const [password, setCurrentPW] = useState("");
  const [newPassword, setNewPW] = useState("");
  const [repeatPW, setRepeatPW] = useState("");

  const [samePW, setSamePW] = useState(true);
  const [checkCurrentPW, setCheckCurrentPW] = useState(true);
  const [validPW, setValidPW] = useState(true);
  const [validFirstName, setValidFirstName] = useState(true);
  const [validMiddleName, setValidMiddleName] = useState(true);
  const [validLastName, setValidLastName] = useState(true);

  const [securityQuestion1, setSecurityQuestion1] = useState(null);
  const [securityQuestion2, setSecurityQuestion2] = useState(null);
  const [securityQuestion3, setSecurityQuestion3] = useState(null);
  const [securityAnswer1, setSecurityAnswer1] = useState("");
  const [securityAnswer2, setSecurityAnswer2] = useState("");
  const [securityAnswer3, setSecurityAnswer3] = useState("");
  const [checker, setChecker] = useState(0);
  const [recoveryPW, setRecoveryPW] = useState("");

  const currentPasswordRef = createRef();
  const newPasswordRef = createRef();
  const repeatPasswordRef = createRef();
  const cpTogglerRef = createRef();
  const npTogglerRef = createRef();
  const rpTogglerRef = createRef();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  useEffect(() => {
    fetch(apiUrl("/auth/"), {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.User) {
          setFName(data.User.first_name);
          setMName(data.User.middle_name);
          setLName(data.User.last_name);
          setEmail(data.User.email);
          setUserID(data.User._id);
        } else {
          window.location.replace("/");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const handleChangePW = (e) => {
    e.preventDefault();
    fetch(apiUrl("/user/" + userID), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        password: password,
        new_password: newPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setCheckCurrentPW(true);

        if (data.message === "User successfully edited") {
          window.location.reload();
        } else if (data.message === "Wrong password") {
          setCheckCurrentPW(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    setIsOpen(true);
    setChecker(0);
  };

  const changeFName = (e) => {
    setFName(toTitleCase(e));
  };

  const changeMName = (e) => {
    setMName(toTitleCase(e));
  };

  const changeLName = (e) => {
    setLName(toTitleCase(e));
  };

  const handleRecoveryQA = (e) => {
    e.preventDefault();
    setIsOpen(true);
    setChecker(1);
  };

  return (
    <div>
      {isOpen &&
        (checker ? (
          <EditProfileModal
            setIsOpen={setIsOpen}
            checker={checker}
            recoveryQ1={securityQuestion1}
            recoverQ2={securityQuestion2}
            recoveryQ3={securityQuestion3}
            recoveryA1={securityAnswer1}
            recoveryA2={securityAnswer2}
            recoveryA3={securityAnswer3}
            userID={userID}
          />
        ) : (
          <EditProfileModal
            setIsOpen={setIsOpen}
            firstName={firstName}
            middleName={middleName}
            lastName={lastName}
            email={email}
            userID={userID}
          />
        ))}
      <div>
        <h2 className={"text-center " + styles.headerEditProfile}>
          Edit Profile
        </h2>
        <div id={styles.main} className={"container " + styles.container}>
          <div className="row">
            <div className="col-12 col-md-6">
              <h5>Personal Information</h5>
              <p className="text-muted">
                Modify your personal information by updating the details and
                clicking the button to apply the changes.
              </p>
              <p className="text-muted">
                Make sure that the provided information is accurate and true.
              </p>
            </div>
            <div className="col-12 col-md-6">
              <form>
                <div className="col mb-3">
                  <div className="row">
                    <div className="col-12 col-sm-6">
                      <label className="small text-muted">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        onChange={(e) => {
                          setValidFirstName(checkName(e.target.value));
                          changeFName(e.target.value);
                        }}
                        value={firstName}
                      ></input>
                      {!validFirstName && (
                        <div className="invalid-feedback d-block mb-3">
                          Invalid first name
                        </div>
                      )}
                    </div>
                    <div className="col-12 col-sm-6">
                      <label className="small text-muted">Middle Name</label>
                      <input
                        type="text"
                        className="form-control"
                        onChange={(e) => {
                          setValidMiddleName(checkMiddleName(e.target.value));
                          changeMName(e.target.value);
                        }}
                        value={middleName}
                      ></input>
                      {!validMiddleName && (
                        <div className="invalid-feedback d-block mb-3">
                          Invalid middle name
                        </div>
                      )}
                    </div>
                  </div>
                  <label className="small text-muted">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => {
                      setValidLastName(checkName(e.target.value));
                      changeLName(e.target.value);
                    }}
                    value={lastName}
                  ></input>
                  {!validLastName && (
                    <div className="invalid-feedback d-block mb-3">
                      Invalid last name
                    </div>
                  )}
                  <label className="small text-muted">Email</label>
                  <input
                    type="text"
                    className="form-control mb-3"
                    value={email}
                    disabled
                  ></input>
                </div>
                <button
                  id={styles.buttonSC}
                  className={"btn " + styles.btnPrimary}
                  onClick={handleUserSubmit}
                  disabled={
                    !firstName ||
                    !validFirstName ||
                    !validMiddleName ||
                    !lastName ||
                    !validLastName
                  }
                >
                  SAVE CHANGES
                </button>
              </form>
            </div>
          </div>
        </div>

        <div id={styles.main} className={"container " + styles.container}>
          <div className="row">
            <div className="col-12 col-md-6">
              <h3 className={styles.subheadEditProfile}>Change Password</h3>
              <p className={"mb-1 " + styles.bodyEditProfile}>
                Your new password:
              </p>
              <PasswordReqs password={newPassword} />
              <p className={"mb-1 " + styles.bodyEditProfile}>
                Make sure that your password does not include all or part of
                your username, first name, or last name.
              </p>
            </div>
            <div className="col-12 col-md-6">
              <div className="col mb-1">
                <form>
                  <div className="form-group mb-3">
                    <label className="small text-muted">Current Password</label>
                    <div className="input-group">
                      <input
                        type="password"
                        className={`form-control border-end-0 ${
                          !checkCurrentPW && "border-danger"
                        }`}
                        id="currentPassword"
                        ref={currentPasswordRef}
                        onChange={(e) => {
                          setCurrentPW(e.target.value);
                        }}
                        required
                      ></input>
                      <span
                        className={`input-group-text bg-white p-0 border-start-0 rounded-end ${
                          !checkCurrentPW && "border-danger"
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
                      {!checkCurrentPW && (
                        <div className="invalid-feedback d-block">
                          Wrong password
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-group mb-3">
                    <label className="small text-muted">New Password</label>
                    <div className="input-group">
                      <input
                        type="password"
                        className={`form-control border-end-0 ${
                          !validPW && "is-invalid"
                        }`}
                        id="newPassword"
                        ref={newPasswordRef}
                        value={newPassword}
                        onChange={(e) => {
                          setValidPW(checkPassword(e.target.value));
                          setNewPW(e.target.value);
                        }}
                        required
                      ></input>
                      <span
                        className={`input-group-text bg-white p-0 border-start-0 rounded-end ${
                          !validPW && "border-danger"
                        }`}
                      >
                        <div
                          className="btn py-1 px-2"
                          onClick={() => {
                            toggleVisibility(newPasswordRef, npTogglerRef);
                          }}
                        >
                          <i className="bi bi-eye" ref={npTogglerRef}></i>
                        </div>
                      </span>
                      {!validPW && (
                        <div className="invalid-feedback">
                          Missing password requirements
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-group mb-3">
                    <label className="small text-muted">
                      Confirm New Password
                    </label>
                    <div className="input-group">
                      <input
                        type="password"
                        className={`form-control border-end-0 ${
                          !samePW && "is-invalid"
                        }`}
                        id="confirm"
                        ref={repeatPasswordRef}
                        value={repeatPW}
                        onChange={(e) => {
                          setSamePW(
                            checkPasswordEquality(newPassword, e.target.value)
                          );
                          setRepeatPW(e.target.value);
                        }}
                        required
                      ></input>
                      <span
                        className={`input-group-text bg-white p-0 border-start-0 rounded-end ${
                          !samePW && "border-danger"
                        }`}
                      >
                        <div
                          className="btn py-1 px-2"
                          onClick={() => {
                            toggleVisibility(repeatPasswordRef, rpTogglerRef);
                          }}
                        >
                          <i className="bi bi-eye" ref={rpTogglerRef}></i>
                        </div>
                      </span>
                      {!samePW && (
                        <div className="invalid-feedback">
                          Passwords do not match
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    id={styles.buttonCP}
                    className={"btn " + styles.btnPrimary}
                    onClick={handleChangePW}
                    disabled={
                      !password ||
                      !newPassword ||
                      !repeatPW ||
                      !samePW ||
                      !validPW
                    }
                  >
                    CHANGE PASSWORD
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        {email !== "admin" ? (
          <div id={styles.main} className={"container " + styles.container}>
            <div className="row">
              <div className="col-12 col-md-6">
                <h3 className={styles.subheadEditProfile}>
                  Security Questions
                </h3>
                <p className="text-muted">
                  Modify your security questions and click the button to apply
                  the changes. You can change the answer to your previous
                  question or choose a new security question.
                </p>
                <p className="text-muted">
                  Make sure that the provided information is accurate and true.
                </p>
              </div>
              <div className="col-12 col-md-6">
                <SecurityQuestions
                  securityQuestion1={securityQuestion1}
                  setSecurityQuestion1={setSecurityQuestion1}
                  securityAnswer1={securityAnswer1}
                  setSecurityAnswer1={setSecurityAnswer1}
                  securityQuestion2={securityQuestion2}
                  setSecurityQuestion2={setSecurityQuestion2}
                  securityAnswer2={securityAnswer2}
                  setSecurityAnswer2={setSecurityAnswer2}
                  securityQuestion3={securityQuestion3}
                  setSecurityQuestion3={setSecurityQuestion3}
                  securityAnswer3={securityAnswer3}
                  setSecurityAnswer3={setSecurityAnswer3}
                  checker={checker}
                />
                <button
                  id={styles.buttonCP}
                  className={"btn " + styles.btnPrimary}
                  onClick={handleRecoveryQA}
                  disabled={
                    !securityQuestion1 ||
                    !securityAnswer1 ||
                    !securityQuestion2 ||
                    !securityAnswer2 ||
                    !securityQuestion3 ||
                    !securityAnswer3
                  }
                >
                  UPDATE SECURITY QUESTIONS
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
