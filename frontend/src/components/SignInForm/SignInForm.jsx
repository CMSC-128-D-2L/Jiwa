import styles from "./SignInForm.module.css";
import { createRef, useState } from "react";
import { Link } from "react-router-dom";
import { toggleVisibility } from "../../utilities/toggleVisibility";
import { apiUrl } from "../../utilities/apiUrl";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const passwordRef = createRef();
  const togglerRef = createRef();
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const [validUser, setValidUser] = useState(true);

  const submitForm = (e) => {
    e.preventDefault();

    fetch(apiUrl("/auth/"), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setValidEmail(true);
        setValidPassword(true);
        setValidUser(true);

        if (data.success === true) {
          window.location.replace("/dashboard");
        } else if (data.message === "User does not exist") {
          setValidEmail(false);
        } else if (data.message === "Wrong password") {
          setValidPassword(false);
        } else if (data.message === "Insufficient data") {
          !email.trim() ? setValidEmail(false) : setValidPassword(false);
        } else if (data.message === "User is not approved.") {
          setValidUser(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="container">
      <div className="row d-flex min-vh-100 justify-content-center align-items-center">
        <div className="col"></div>
        <div
          className={
            "col-12 col-sm-8 text-center borderRadius " + styles.formContainer
          }
        >
          <h1>
            <b>Login</b>
          </h1>
          <small>
            Welcome to GWA Verifier!
            <br />
            Login to upload and edit documents!
          </small>
          <form className="needs-validation">
            <div className={styles.fieldsContainer}>
              <div className="form-group mb-3">
                <label htmlFor="email" className="small float-start">
                  Email Address
                </label>
                <input
                  type="email"
                  className={`form-control ${
                    (!validEmail || !validUser) && "is-invalid"
                  }`}
                  id="email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  required
                ></input>
                {!validEmail && (
                  <div className="invalid-feedback">
                    Couldn&apos;t find your account
                  </div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="password" className="small float-start">
                  Password
                </label>
                <div className="input-group">
                  <input
                    type="password"
                    className={`form-control border-end-0 ${
                      (!validPassword || !validUser) && "is-invalid"
                    }`}
                    id="password"
                    ref={passwordRef}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    required
                  ></input>
                  <span
                    className={`input-group-text bg-white p-0 border-start-0 rounded-end ${
                      (!validPassword || !validUser) && "border-danger"
                    }`}
                  >
                    <div
                      className="btn py-1 px-2"
                      onClick={() => {
                        toggleVisibility(passwordRef, togglerRef);
                      }}
                    >
                      <i className="bi bi-eye" ref={togglerRef}></i>
                    </div>
                  </span>
                  {!validPassword && (
                    <div className="invalid-feedback">Wrong password</div>
                  )}
                </div>
                <Link to="/forgot-password" className="small float-end">
                  Forgot Password?
                </Link>
              </div>
            </div>
            <div className={styles.btnContainer}>
              <button
                type="submit"
                className={styles.btnLogin}
                onClick={submitForm}
              >
                LOGIN
              </button>
              {!validUser && (
                <div className="small text-danger pt-1">
                  User needs admin approval.
                </div>
              )}
            </div>
            <small id="createAccount" className="form-text text-muted">
              New here? <Link to="/sign-up">Create Account</Link>
            </small>
          </form>
        </div>
        <div className="col"></div>
      </div>
    </div>
  );
};
