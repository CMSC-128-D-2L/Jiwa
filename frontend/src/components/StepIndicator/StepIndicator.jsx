import styles from "./StepIndicator.module.css";

export const StepIndicator = ({ title, currentStep }) => {
  return (
    <div className="row p-5">
      <div className="col-12 text-center">
        <h1>
          <b>{title}</b>
        </h1>
      </div>
      <div className="d-flex justify-content-center gap-3">
        <div className="d-flex flex-column align-items-center gap-2">
          <div
            className={`${styles.stepCircle} ${
              currentStep === 1 ? styles.current : styles.done
            }`}
          >
            <p className="text-white">
              <b>1</b>
            </p>
          </div>
          <p className="text-muted">Upload</p>
        </div>
        <div
          className={`${styles.connector} ${
            currentStep > 1 ? styles.done : styles.todoconnector
          }`}
        ></div>
        <div className="d-flex flex-column align-items-center gap-2">
          <div
            className={`${styles.stepCircle} ${
              currentStep === 1 && styles.todo
            } ${currentStep === 2 && styles.current} ${
              currentStep === 3 && styles.done
            }`}
          >
            <p className={`${currentStep > 1 ? "text-white" : "text-muted"}`}>
              <b>2</b>
            </p>
          </div>
          <p className="text-muted">Verify</p>
        </div>
      </div>
    </div>
  );
};
