import { createRef, useState } from "react";
import { toggleVisibility } from "../../utilities/toggleVisibility";
import { apiUrl } from "../../utilities/apiUrl";
import styles from "./ViewRecordsModal.module.css";
import useAsyncState from "../../utilities/useAsyncState.js";
import { useSearchParams } from "react-router-dom";

export const ViewRecordsModal = ({
  setIsOpen,
  setToDel,
  toDel,
  setData,
  data,
}) => {
  const ids = toDel.map((item) => item._id);
  const names = toDel.map((item) => item.firstName + " " + item.lastName);
  const [hasError, setHasError] = useAsyncState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const deleteData = () => {
    fetch(apiUrl("/auth/"), {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((temp) => {
        const { email, role } = temp.User;
        const check = toDel.filter((user) => user.uploaderEmail !== email);
        if (check.length === 0 || role === "admin")
          fetch(apiUrl("/student/"), {
            method: "DELETE",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ids: ids,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              setData((data) => data.filter((item) => !ids.includes(item._id)));
              setIsOpen(false);
            })
            .catch((err) => {
              console.log(err);
            });
        else if (check.length >= 1) {
          setHasError(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
      <div className={styles.mainCentered}>
        <div className={styles.modal}>
          <button
            className={"btn-close " + styles.modalClose}
            aria-label="Close modal"
            onClick={() => {
              setToDel([]);
              data.map((user) => (user.checked = false));
              setIsOpen(false);
              setHasError(false);
            }}
          ></button>
          <div className={"py-2 " + styles.saveHeader}>
            <h3 className={styles.saveHeading}>
              {hasError === true
                ? "Cannot delete student/s"
                : toDel.length === 0
                ? "No Students Selected"
                : "Are you sure you want to delete this/these students?"}
            </h3>
          </div>
          <div>
            {hasError === true ? (
              "You can only delete students you uploaded"
            ) : toDel.length === 0 ? (
              <span className="text-muted">
                Please select some students before deleting
              </span>
            ) : (
              <span>
                {names.join(", ")}
                <br />
              </span>
            )}
          </div>
          {toDel.length > 0 && !hasError ? (
            <button
              type="submit"
              className={styles.modalSave}
              onClick={() => {
                deleteData();
              }}
            >
              CONFIRM
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};
