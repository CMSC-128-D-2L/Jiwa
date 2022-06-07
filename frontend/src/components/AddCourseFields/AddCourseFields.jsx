import styles from "./AddCourseFields.module.css";

export const AddCourseFields = ({
  handleInputCourseCode,
  inputCourseCode,
  handleInputUnits,
  inputUnits,
  handleInputGrade,
  inputGrade,
  handleInputWeight,
  inputWeight,
  handleInputTerm,
  addRow,
  inputErrorPresent,
}) => {
  return (
    <div>
      <div className={styles.inputTable}>
        <div className="row py-lg-4 px-lg-4">
          <div className="col-auto mx-lg-2">
            <p className={"secondaryText " + styles.csLabel}>Course Code</p>
            <h4>
              <input
                className={styles.inputCourseInfo}
                type="text"
                onChange={handleInputCourseCode}
                value={inputCourseCode}
              ></input>
            </h4>
          </div>
          <div className="col-auto mx-lg-3">
            <p className={"secondaryText " + styles.csLabel}>Units</p>
            <h4>
              <input
                className={styles.inputCourseInfo}
                type="text"
                onChange={handleInputUnits}
                value={inputUnits}
              ></input>
            </h4>
          </div>
          <div className="col-auto mx-lg-2">
            <p className={"secondaryText " + styles.csLabel}>Grade</p>
            <h4>
              <input
                className={styles.inputCourseInfo}
                type="text"
                onChange={handleInputGrade}
                value={inputGrade}
              ></input>
            </h4>
          </div>
          <div className="col-auto mx-lg-3">
            <p className={"secondaryText " + styles.csLabel}>Weight</p>
            <h4>
              <input
                className={styles.inputCourseInfo}
                type="text"
                onChange={handleInputWeight}
                value={inputWeight}
              ></input>
            </h4>
          </div>
          <div className="col-auto mx-lg-2">
            <p className={"secondaryText " + styles.csLabel}>Term</p>
            <h4>
              <input
                className={styles.inputCourseInfo}
                type="text"
                onChange={handleInputTerm}
              ></input>
            </h4>
          </div>
          <div className={"col-auto mx-lg-3 " + styles.btnDiv}>
            <button
              className={styles.addBtn}
              onClick={addRow}
              disabled={inputErrorPresent}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
