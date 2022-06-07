import { useEffect, useState } from "react";
import {
  checkSecurityQuestion,
  checkAnswer,
  toTitleCase,
} from "../../utilities/inputVerification";

export const SecurityQuestions = ({
  securityQuestion1,
  setSecurityQuestion1,
  securityAnswer1,
  setSecurityAnswer1,
  securityQuestion2,
  setSecurityQuestion2,
  securityAnswer2,
  setSecurityAnswer2,
  securityQuestion3,
  setSecurityQuestion3,
  securityAnswer3,
  setSecurityAnswer3,
  checker,
}) => {
  const securityQuestions = [
    "What was the name of your first stuffed animal?",
    "What was the name of the boy or the girl you first kissed?",
    "Where were you when you had your first kiss?",
    "In what city did you meet your spouse/significant other?",
    "What is the middle name of your youngest child?",
    "In what city or town did your mother and father meet?",
    "What is your oldest cousin's first and last name?",
    "What was the first exam you failed?",
    "What was the name of the street you grew up in?",
  ];
  const [validSecurityQuestion1, setValidSecurityQuestion1] = useState(true);
  const [validSecurityQuestion2, setValidSecurityQuestion2] = useState(true);
  const [validSecurityQuestion3, setValidSecurityQuestion3] = useState(true);
  const [validSecurityAnswer1, setValidSecurityAnswer1] = useState(true);
  const [validSecurityAnswer2, setValidSecurityAnswer2] = useState(true);
  const [validSecurityAnswer3, setValidSecurityAnswer3] = useState(true);

  useEffect(() => {
    if (checker === 1) {
      if (!securityQuestion1) {
        setValidSecurityQuestion1(false);
      }
      if (!securityAnswer1) {
        setValidSecurityAnswer1(false);
      }
      if (!securityQuestion2) {
        setValidSecurityQuestion2(false);
      }
      if (!securityAnswer2) {
        setValidSecurityAnswer2(false);
      }
      if (!securityQuestion3) {
        setValidSecurityQuestion3(false);
      }
      if (!securityAnswer3) {
        setValidSecurityAnswer3(false);
      }
    }
  });

  return (
    <div>
      <div className="form-group mb-4">
        <label htmlFor="inputGroupSelect01" className="small float-start">
          Security Question 1
        </label>
        <select
          className={`form-select form-control ${
            !validSecurityQuestion1 && "is-invalid"
          }`}
          id="inputGroupSelect01"
          onChange={(e) => {
            setValidSecurityQuestion1(
              checkSecurityQuestion(e.target.selectedIndex)
            );
            setSecurityQuestion1(e.target.selectedIndex);
          }}
        >
          <option>Choose...</option>
          {securityQuestions.map((question, i) => (
            <option
              disabled={
                i == securityQuestion1 - 1 ||
                i == securityQuestion2 - 1 ||
                i == securityQuestion3 - 1
              }
              key={i}
            >
              {question}
            </option>
          ))}
        </select>
        {!validSecurityQuestion1 && (
          <div className="invalid-feedback">
            Please choose a security question.
          </div>
        )}
        <label htmlFor="answer1" className="small float-start pt-2">
          Answer
        </label>
        <input
          type="text"
          id="answer1"
          className={`form-control ${!validSecurityAnswer1 && "is-invalid"}`}
          value={securityAnswer1}
          onChange={(e) => {
            setValidSecurityAnswer1(checkAnswer(e.target.value));
            setSecurityAnswer1(toTitleCase(e.target.value));
          }}
        ></input>
        {!validSecurityAnswer1 && (
          <div className="invalid-feedback">
            Please answer the security question.
          </div>
        )}
      </div>

      <div className="form-group mb-4">
        <label htmlFor="inputGroupSelect02" className="small float-start">
          Security Question 2
        </label>
        <select
          className={`form-select form-control ${
            !validSecurityQuestion2 && "is-invalid"
          }`}
          id="inputGroupSelect02"
          onChange={(e) => {
            setValidSecurityQuestion2(
              checkSecurityQuestion(e.target.selectedIndex)
            );
            setSecurityQuestion2(e.target.selectedIndex);
          }}
        >
          <option>Choose...</option>
          {securityQuestions.map((question, i) => (
            <option
              disabled={
                i == securityQuestion1 - 1 ||
                i == securityQuestion2 - 1 ||
                i == securityQuestion3 - 1
              }
              key={i}
            >
              {question}
            </option>
          ))}
        </select>
        {!validSecurityQuestion2 && (
          <div className="invalid-feedback">
            Please choose a security question.
          </div>
        )}

        <label htmlFor="answer2" className="small float-start pt-2">
          Answer
        </label>
        <input
          type="text"
          id="answer2"
          className={`form-control ${!validSecurityAnswer2 && "is-invalid"}`}
          value={securityAnswer2}
          onChange={(e) => {
            setValidSecurityAnswer2(checkAnswer(e.target.value));
            setSecurityAnswer2(toTitleCase(e.target.value));
          }}
        ></input>
        {!validSecurityAnswer2 && (
          <div className="invalid-feedback">
            Please answer the security question.
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="inputGroupSelect03" className="small float-start">
          Security Question 3
        </label>
        <select
          className={`form-select form-control ${
            !validSecurityQuestion3 && "is-invalid"
          }`}
          id="inputGroupSelect03"
          onChange={(e) => {
            setValidSecurityQuestion3(
              checkSecurityQuestion(e.target.selectedIndex)
            );
            setSecurityQuestion3(e.target.selectedIndex);
          }}
        >
          <option>Choose...</option>
          {securityQuestions.map((question, i) => (
            <option
              disabled={
                i == securityQuestion1 - 1 ||
                i == securityQuestion2 - 1 ||
                i == securityQuestion3 - 1
              }
              key={i}
            >
              {question}
            </option>
          ))}
        </select>
        {!validSecurityQuestion3 && (
          <div className="invalid-feedback">
            Please choose a security question.
          </div>
        )}

        <label htmlFor="answer3" className="small float-start pt-2">
          Answer
        </label>
        <input
          type="text"
          id="answer3"
          className={`form-control ${!validSecurityAnswer3 && "is-invalid"}`}
          value={securityAnswer3}
          onChange={(e) => {
            setValidSecurityAnswer3(checkAnswer(e.target.value));
            setSecurityAnswer3(toTitleCase(e.target.value));
          }}
        ></input>
        {!validSecurityAnswer3 && (
          <div className="invalid-feedback">
            Please answer the security question.
          </div>
        )}
      </div>
    </div>
  );
};
