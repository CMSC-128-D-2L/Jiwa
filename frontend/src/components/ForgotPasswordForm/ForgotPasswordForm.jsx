import styles from "./ForgotPasswordForm.module.css";
import { createRef, useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { SecurityQuestions } from "../SecurityQuestions";
import { PasswordReqs } from "../PasswordReqs";
import { toggleVisibility } from "../../utilities/toggleVisibility";
import { apiUrl } from "../../utilities/apiUrl";
import {
  checkEmail,
  checkPassword,
  checkPasswordEquality,
} from "../../utilities/inputVerification";

export const ForgotPasswordForm = () => {
  const [stepNumber, setStepNumber] = useState(1);
  const [securityQuestion1, setSecurityQuestion1] = useState(null);
  const [securityQuestion2, setSecurityQuestion2] = useState(null);
  const [securityQuestion3, setSecurityQuestion3] = useState(null);
  const [securityAnswer1, setSecurityAnswer1] = useState("");
  const [securityAnswer2, setSecurityAnswer2] = useState("");
  const [securityAnswer3, setSecurityAnswer3] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorQnA, setErrorQnA] = useState(false);
  const [waitingApproval, setWaitingApproval] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  const [password, setPassword] = useState("");
  const [validPass, setValidPass] = useState(true);
  const [repeatPassword, setRepeatPassword] = useState("");
  const [samePassword, setSamePassword] = useState(true);
  const [newPass, setNewPass] = useState("");
  let [_id, setID] = useState("");
  let [token, setToken] = useState("");

  const newPasswordRef = createRef();
  const confirmPasswordRef = createRef();
  const npTogglerRef = createRef();
  const cpTogglerRef = createRef();
  const [checker, setChecker] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    let id = "";
    if (stepNumber === 1) {
      let error = false;
      if (!validEmail || !email) {
        setValidEmail(false);
        error = true;
      }
      if (!error) {
        fetch(apiUrl("/auth/verifyEmail"), {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Success:", data);
            if (
              data.success &&
              data.message === "Admin changed user password"
            ) {
              e.preventDefault();
              setStepNumber(4);
              setNewPass(data.password);
            } else if (data.message === "Waiting for admin approval") {
              e.preventDefault();
              setWaitingApproval(true);
            } else if (data.success) {
              e.preventDefault();
              setStepNumber(2);
              setID(data._id);
              id = data._id;
            } else if (data.message === "No user found") {
              setErrorEmail(true);
              console.log(error);
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    } else if (stepNumber === 2) {
      fetch(apiUrl("/auth/verifyQNA"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id,
          recoveryQA: [
            { question: securityQuestion1, answer: securityAnswer1 },
            { question: securityQuestion2, answer: securityAnswer2 },
            { question: securityQuestion3, answer: securityAnswer3 },
          ],
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          if (data.success) {
            e.preventDefault();
            setToken(data.token);
            setStepNumber(3);
          } else {
            setErrorQnA(true);
            setChecker(1);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else if (stepNumber === 3) {
      let error = false;
      if (!password || !validPass) {
        setValidPass(false);
        error = true;
      }
      if (!samePassword || !repeatPassword) {
        setSamePassword(false);
        error = true;
      }
      if (!error) {
        fetch(apiUrl("/auth/forgotpassword"), {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            new_password: password,
            forgotPasswordToken: token,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Success:", data);
            if (data.success) {
              setStepNumber(6);
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    }
  };

  const handleRequest = (e) => {
    fetch(apiUrl("/message/"), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        if (data.success) {
          e.preventDefault();
          setStepNumber(5);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    fetch(apiUrl("/auth/"), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: newPass,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === true) {
          window.location.replace("/dashboard");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      {stepNumber === 1 && (
        <div className="container">
          <div className="row d-flex min-vh-100 justify-content-center align-items-center">
            <div className="col"></div>
            <div
              className={
                "col-12 col-sm-8 col-md-6 text-center borderRadius " +
                styles.formContainer
              }
            >
              <h1>
                <b>Change Password</b>
              </h1>
              <small>Enter the email address associated to your account.</small>
              <form>
                <div className={styles.fieldsContainer}>
                  <div className="form-group">
                    <label htmlFor="email" className="small float-start">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className={`form-control ${!validEmail && "is-invalid"} ${
                        errorEmail && "is-invalid"
                      } ${waitingApproval && "is-invalid"}`}
                      id="email"
                      value={email}
                      onChange={(e) => {
                        setValidEmail(checkEmail(e.target.value));
                        setEmail(e.target.value);
                        setErrorEmail(false);
                      }}
                      required
                    ></input>
                    {!validEmail && (
                      <div className="invalid-feedback">Invalid email</div>
                    )}
                    {errorEmail && (
                      <div className="invalid-feedback">
                        User does not exist
                      </div>
                    )}
                    {waitingApproval && (
                      <div className="invalid-feedback">
                        Waiting for approval from admin to change password.
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className={styles.btnNext}
                >
                  SUBMIT
                </button>
                <small>
                  <Link to="/">Cancel</Link>
                </small>
              </form>
            </div>
            <div className="col"></div>
          </div>
        </div>
      )}
      {stepNumber === 2 && (
        <div className="container">
          <div className="row d-flex min-vh-100 justify-content-center align-items-center">
            <div className="col"></div>
            <div
              className={
                "col-12 col-lg-7 my-sm-5 text-center borderRadius " +
                styles.formContainer
              }
            >
              <h1>
                <b>Change Password</b>
              </h1>
              <small>Please choose and answer your security questions.</small>
              <form>
                <div className={styles.fieldsContainer}>
                  <SecurityQuestions
                    securityQuestion1={securityQuestion1}
                    securityAnswer1={securityAnswer1}
                    setSecurityQuestion1={setSecurityQuestion1}
                    setSecurityAnswer1={setSecurityAnswer1}
                    securityQuestion2={securityQuestion2}
                    securityAnswer2={securityAnswer2}
                    setSecurityQuestion2={setSecurityQuestion2}
                    setSecurityAnswer2={setSecurityAnswer2}
                    securityQuestion3={securityQuestion3}
                    securityAnswer3={securityAnswer3}
                    setSecurityQuestion3={setSecurityQuestion3}
                    setSecurityAnswer3={setSecurityAnswer3}
                    checker={checker}
                  />
                </div>
                {errorQnA && (
                  <div className="text-danger">
                    One or more questions or answers are wrong. Please try
                    again.
                  </div>
                )}
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className={styles.btnNext}
                >
                  SUBMIT
                </button>
                <small>
                  <Link to="/">Cancel</Link>
                </small>
                <div>
                  <small>
                    Forgot Questions or Answers?
                    <a className="link-primary" onClick={handleRequest}>
                      {" "}
                      Request Admin
                    </a>
                  </small>
                </div>
              </form>
            </div>
            <div className="col"></div>
          </div>
        </div>
      )}
      {stepNumber === 3 && (
        <div className="container">
          <div className="row d-flex min-vh-100 justify-content-center align-items-center">
            <div className="col"></div>
            <div
              className={
                "col-12 col-sm-8 text-center borderRadius " +
                styles.formContainer
              }
            >
              <h1>
                <b>Change Password</b>
              </h1>
              <form>
                <div className={styles.fieldsContainer}>
                  <div className="form-group mb-3">
                    <label htmlFor="newPassword" className="small float-start">
                      New Password
                    </label>
                    <div className="input-group">
                      <input
                        type="password"
                        className={`form-control border-end-0 ${
                          !validPass && "is-invalid"
                        }`}
                        id="newPassword"
                        ref={newPasswordRef}
                        onChange={(e) => {
                          setValidPass(checkPassword(e.target.value));
                          setPassword(e.target.value);
                        }}
                        required
                      ></input>
                      <span
                        className={`input-group-text bg-white p-0 border-start-0 rounded-end ${
                          !validPass && "border-danger"
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
                      {!validPass && (
                        <div className="invalid-feedback">
                          Missing password requirements
                        </div>
                      )}
                    </div>
                  </div>
                  <PasswordReqs password={password} />
                  <div className="form-group">
                    <label
                      htmlFor="confirmPassword"
                      className="small float-start"
                    >
                      Confirm Password
                    </label>
                    <div className="input-group">
                      <input
                        type="password"
                        className={`form-control border-end-0 ${
                          !samePassword && "is-invalid"
                        }`}
                        id="confirmPassword"
                        ref={confirmPasswordRef}
                        onChange={(e) => {
                          setSamePassword(
                            checkPasswordEquality(password, e.target.value)
                          );
                          setRepeatPassword(e.target.value);
                        }}
                        required
                      ></input>
                      <span
                        className={`input-group-text bg-white p-0 border-start-0 rounded-end ${
                          !samePassword && "border-danger"
                        }`}
                      >
                        <div
                          className="btn py-1 px-2"
                          onClick={() => {
                            toggleVisibility(confirmPasswordRef, cpTogglerRef);
                          }}
                        >
                          <i className="bi bi-eye" ref={cpTogglerRef}></i>
                        </div>
                      </span>
                      {!samePassword && (
                        <div className="invalid-feedback">
                          Passwords do not match
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className={styles.btnNext}
                >
                  SUBMIT
                </button>
                <small>
                  <Link to="/">Cancel</Link>
                </small>
              </form>
            </div>
            <div className="col"></div>
          </div>
        </div>
      )}
      {stepNumber === 4 && (
        <div className="container">
          <div className="row d-flex min-vh-100 justify-content-center align-items-center">
            <div className="col"></div>
            <div
              className={
                "col-12 col-sm-8 col-md-6 text-center borderRadius " +
                styles.formContainer
              }
            >
              <h1>
                <b>Change Password</b>
              </h1>
              <small>Your new password is shown below:</small>
              <form>
                <div className={styles.fieldsContainer}>
                  <center>
                    <b>{newPass}</b>
                  </center>
                </div>
                <button
                  type="submit"
                  onClick={handleLogin}
                  className={styles.btnNext}
                >
                  LOGIN
                </button>
                <small>
                  <Link to="/">Cancel</Link>
                </small>
              </form>
            </div>
            <div className="col"></div>
          </div>
        </div>
      )}
      {stepNumber === 5 && (
        <div className="container">
          <div className="row d-flex min-vh-100 justify-content-center align-items-center">
            <div className="col"></div>
            <div
              className={
                "col-12 col-sm-8 col-md-6 text-center borderRadius " +
                styles.formContainer
              }
            >
              <h1>
                <b>Change Password</b>
              </h1>
              <form>
                <div className={styles.fieldsContainer}>
                  <center>Your request has been sent to the Admin.</center>
                </div>
                <button
                  type="submit"
                  onClick={() => navigate("/")}
                  className={styles.btnNext}
                >
                  BACK TO LOGIN
                </button>
              </form>
            </div>
            <div className="col"></div>
          </div>
        </div>
      )}
      {stepNumber > 5 && <Navigate to="/" />}
    </div>
  );
};
