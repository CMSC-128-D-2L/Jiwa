import styles from "./SignUpForm.module.css";
import { createRef, useState } from "react";
import { Link } from "react-router-dom";
import { PasswordReqs } from "../PasswordReqs";
import { SecurityQuestions } from "../SecurityQuestions";
import { toggleVisibility } from "../../utilities/toggleVisibility";
import {
  checkName,
  checkMiddleName,
  checkEmail,
  checkPassword,
  checkPasswordEquality,
  toTitleCase,
} from "../../utilities/inputVerification";
import { apiUrl } from "../../utilities/apiUrl";
export const SignUpForm = () => {
  const [firstname, setFirstname] = useState("");
  const [middlename, setMiddleName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [validPass, setValidPass] = useState(true);
  const [validFirstName, setValidFirstName] = useState(true);
  const [validMiddleName, setValidMiddleName] = useState(true);
  const [validLastName, setValidLastName] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [samePassword, setSamePassword] = useState(true);
  const [errorEmail, setErrorEmail] = useState(false);
  const [waitingApproval, setWaitingApproval] = useState(false);
  const [errorQnA, setErrorQnA] = useState(false);

  const [securityQuestion1, setSecurityQuestion1] = useState(null);
  const [securityQuestion2, setSecurityQuestion2] = useState(null);
  const [securityQuestion3, setSecurityQuestion3] = useState(null);
  const [securityAnswer1, setSecurityAnswer1] = useState("");
  const [securityAnswer2, setSecurityAnswer2] = useState("");
  const [securityAnswer3, setSecurityAnswer3] = useState("");

  const passwordRef = createRef();
  const repeatPasswordRef = createRef();
  const pTogglerRef = createRef();
  const rpTogglerRef = createRef();
  const [checker, setChecker] = useState(0);

  const handleSignup = (e) => {
    let error = false;
    setChecker(1);
    e.preventDefault();
    if (!validFirstName || !firstname) {
      setValidFirstName(false);
    }
    if (!validMiddleName) {
      setValidMiddleName(false);
    }
    if (!validLastName || !lastname) {
      setValidLastName(false);
    }
    if (!validEmail || !email) {
      setValidEmail(false);
    }
    if (!validPass || !password) {
      setValidPass(false);
    }
    if (!samePassword || !repeatPassword) {
      setSamePassword(false);
    }
    if (
      !validFirstName ||
      !firstname ||
      !validMiddleName ||
      !validLastName ||
      !lastname ||
      !validEmail ||
      !email ||
      !validPass ||
      !password ||
      !samePassword ||
      !repeatPassword
    ) {
      error = true;
    }
    if (!error) {
      fetch(apiUrl("/user/"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password,
          first_name: firstname,
          middle_name: middlename,
          last_name: lastname,
          email: email,
          recoveryQA: [
            {
              question: securityQuestion1,
              answer: securityAnswer1,
            },
            {
              question: securityQuestion2,
              answer: securityAnswer2,
            },
            {
              question: securityQuestion3,
              answer: securityAnswer3,
            },
          ],
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "New user successfully created") {
            window.location.replace("/");
          } else if (data.message === "User already exist") {
            setErrorEmail(true);
          } else if (
            data.message === "User already exist. Waiting for validation"
          ) {
            setWaitingApproval(true);
          } else if (
            data.message === "Invalid number of recovery questions" ||
            data.message === "Invalid QnAs"
          ) {
            setErrorQnA(true);
          }
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <div className="container">
      <div className="row d-flex min-vh-100 justify-content-center align-items-center">
        <div className="col"></div>
        <div
          className={
            "col-12 col-md-8 text-center my-sm-5 borderRadius " +
            styles.formContainer
          }
        >
          <h1>
            <b>Create Account</b>
          </h1>
          <small>Register to upload, verify, and edit documents.</small>
          <form className="needs-validation" noValidate>
            <div className={styles.fieldsContainer}>
              <div className="row">
                <div className="col-12 col-sm-6 form-group mb-3">
                  <label htmlFor="firstName" className="small float-start">
                    First Name
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      !validFirstName && "is-invalid"
                    }`}
                    id="firstName"
                    value={firstname}
                    onChange={(e) => {
                      setValidFirstName(checkName(e.target.value));
                      setFirstname(toTitleCase(e.target.value));
                    }}
                    required
                  ></input>
                  {!validFirstName && (
                    <div className="invalid-feedback">Invalid first name</div>
                  )}
                </div>
                <div className="col-12 col-sm-6 form-group mb-3">
                  <label htmlFor="middleName" className="small float-start">
                    Middle Name (optional)
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      !validMiddleName && "is-invalid"
                    }`}
                    id="middleName"
                    value={middlename}
                    onChange={(e) => {
                      setValidMiddleName(checkMiddleName(e.target.value));
                      setMiddleName(toTitleCase(e.target.value));
                    }}
                    required
                  ></input>
                  {!validMiddleName && (
                    <div className="invalid-feedback">Invalid middle name</div>
                  )}
                </div>
              </div>
              <div className="form-group mb-3">
                <label htmlFor="lastName" className="small float-start">
                  Last Name
                </label>
                <input
                  type="text"
                  className={`form-control ${!validLastName && "is-invalid"}`}
                  id="lastName"
                  value={lastname}
                  onChange={(e) => {
                    setValidLastName(checkName(e.target.value));
                    setLastname(toTitleCase(e.target.value));
                  }}
                  required
                ></input>
                {!validLastName && (
                  <div className="invalid-feedback">Invalid last name</div>
                )}
              </div>
              <div className="form-group mb-3">
                <label htmlFor="email" className="small float-start">
                  Email
                </label>
                <input
                  type="email"
                  className={`form-control ${!validEmail && "is-invalid"} ${
                    waitingApproval && "is-invalid"
                  } ${errorEmail && "is-invalid"}`}
                  id="email"
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
                  <div className="invalid-feedback">User already exists</div>
                )}
                {waitingApproval && (
                  <div className="invalid-feedback">
                    User is awaiting approval from admin.
                  </div>
                )}
              </div>

              <div className="my-4">
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
              </div>

              <div className="form-group mb-3">
                <label htmlFor="password" className="small float-start">
                  Password
                </label>
                <div className="input-group">
                  <input
                    type="password"
                    className={`form-control border-end-0 ${
                      !validPass && "is-invalid"
                    }`}
                    id="password"
                    ref={passwordRef}
                    // value={password}
                    onChange={(e) => {
                      setValidPass(checkPassword(e.target.value));
                      setPassword(e.target.value);
                    }}
                    required
                  ></input>
                  <span
                    className={`input-group-text bg-white p-0 border-start-0 rounded-end 
                      ${!validPass && "border-danger"}`}
                  >
                    <div
                      className="btn py-1 px-2"
                      onClick={() => {
                        toggleVisibility(passwordRef, pTogglerRef);
                      }}
                    >
                      <i className="bi bi-eye" ref={pTogglerRef}></i>
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

              <div className="form-group mb-3">
                <label htmlFor="confirmPassword" className="small float-start">
                  Confirm Password
                </label>
                <div className="input-group">
                  <input
                    type="password"
                    className={`form-control border-end-0 ${
                      !samePassword && "is-invalid"
                    }`}
                    id="confirmPassword"
                    ref={repeatPasswordRef}
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
                        toggleVisibility(repeatPasswordRef, rpTogglerRef);
                      }}
                    >
                      <i className="bi bi-eye" ref={rpTogglerRef}></i>
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
            {errorQnA && (
              <div className="text-danger">
                Missing Security Questions or Answers. Please try again.
              </div>
            )}
            <button
              type="submit"
              className={styles.btnSignup}
              onClick={handleSignup}
            >
              REGISTER
            </button>
            <small id="createAccount" className="form-text text-muted">
              Already have an account? <Link to="/">Login</Link>
            </small>
          </form>
        </div>
        <div className="col"></div>
      </div>
    </div>
  );
};
