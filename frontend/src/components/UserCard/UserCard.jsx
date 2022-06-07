import $ from "jquery";
import styles from "./UserCard.module.css";
import { useState } from "react";
import { passwordRandomizer } from "../../utilities/passwordRandomizer";
import { Link } from "react-router-dom";
import { apiUrl } from "../../utilities/apiUrl";
import {
  checkName,
  checkMiddleName,
  toTitleCase,
} from "../../utilities/inputVerification";

export const UserCard = ({
  index,
  option,
  id,
  firstName,
  middleName,
  lastName,
  email,
  role,
  requestId,
  set,
  setN,
}) => {
  const [toUpdate, setToUpdate] = useState(null);
  const [toReg, setToReg] = useState(null);
  const [toResetPW, setToResetPW] = useState(false);
  const [toDelReq, setToDelReq] = useState(null);
  const [confirmAction, setConfirmAction] = useState("");
  const [password, setPassword] = useState("");
  const [newFirstName, setNewFirstName] = useState(firstName);
  const [validFirstName, setValidFirstName] = useState(true);
  const [newMiddleName, setNewMiddleName] = useState(middleName);
  const [validMiddleName, setValidMiddleName] = useState(true);
  const [newLastName, setNewLastName] = useState(lastName);
  const [validLastName, setValidLastName] = useState(true);
  const [validConfirmation, setValidConfirmation] = useState(false);
  const [transferStyles, setTransferStyles] = useState(false);

  const modalId = "modal" + index;

  const handleCloseModal = () => {
    setToUpdate(null);
    setToReg(null);
    setToResetPW(false);
    setConfirmAction("");
    setPassword("");
    setNewFirstName(firstName);
    setValidFirstName(true);
    setNewMiddleName(middleName);
    setValidMiddleName(true);
    setNewLastName(lastName);
    setValidLastName(true);
    setValidConfirmation(false);
    setTransferStyles(false);
  };

  const dismissModal = () => {
    $("#" + modalId).removeClass("in");
    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");
    $("body").css("padding-right", "");
    $("#" + modalId).hide();
    $("body").css("overflow", "unset");
  };

  const handleUpdateUser = () => {
    setValidConfirmation(confirmAction == toUpdate);
    if (confirmAction == toUpdate) {
      if (toUpdate === "update user") updateUser();
      else if (toUpdate === "delete user") deleteUser();
    }
  };

  const handleReg = () => {
    setValidConfirmation(confirmAction == toReg);
    if (confirmAction == toReg) {
      let isResolved;
      if (toReg === "confirm registration") isResolved = true;
      else if (toReg === "decline registration") isResolved = false;
      fetch(apiUrl(`/message/`), {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: requestId,
          isResolved: isResolved,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          fetch(apiUrl(`/message/?reqType=create`), {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              set(data.Messages);
              setN(data.Messages.length);
              dismissModal();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleDelReq = () => {
    setValidConfirmation(confirmAction == toDelReq);
    if (confirmAction == toDelReq) {
      fetch(apiUrl(`/message/`), {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: requestId,
          isResolved: false,
          password: "HUEHUEHUE",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          fetch(apiUrl(`/message/?reqType=edit`), {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              set(data.Messages);
              setN(data.Messages.length);
              dismissModal();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleResetPassword = () => {
    setValidConfirmation(password.trim() != "");
    if (password.trim() != "") {
      fetch(apiUrl(`/message/`), {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: requestId,
          isResolved: true,
          password: password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          fetch(apiUrl(`/message/?reqType=edit`), {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              set(data.Messages);
              setN(data.Messages.length);
              dismissModal();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleFirstName = (fname) => {
    setNewFirstName(toTitleCase(fname));
    setValidFirstName(checkName(fname));
  };

  const handleMiddleName = (mname) => {
    setNewMiddleName(toTitleCase(mname));
    setValidMiddleName(checkMiddleName(mname));
  };

  const handleLastName = (lname) => {
    setNewLastName(toTitleCase(lname));
    setValidLastName(checkName(lname));
  };

  const deleteUser = () => {
    fetch(apiUrl(`/user/`), {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ids: [id],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        fetch(apiUrl(`/user/`), {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            set(data.User);
            setN(data.User.length);
            dismissModal();
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateUser = () => {
    fetch(apiUrl(`/user/${id}`), {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password,
        first_name: newFirstName,
        middle_name: newMiddleName,
        last_name: newLastName,
        Email: email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        fetch(apiUrl(`/user/`), {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            set(data.User);
            setN(data.User.length);
            dismissModal();
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="col-sm-6 col-md-4 col-lg-3 text-center p-2 ">
      <div
        className="modal"
        id={modalId}
        aria-labelledby="userModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
          <div className="modal-content borderRadius border-0">
            <div className="modal-header border-0">
              <button
                type="button"
                className="btn-close btn-sm"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body pt-0">
              <h3 className={styles.title}>
                {firstName +
                  " " +
                  (middleName ? middleName[0] + "." : "") +
                  " " +
                  lastName}
              </h3>
              <form className="py-3 text-start row">
                <div className="form-group col-sm-6 pb-3">
                  <label
                    htmlFor="firstName"
                    className="small float-start text-muted"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    className={
                      "form-control " +
                      (option == "users" && email != "admin"
                        ? ""
                        : "bg-white border-0 disabled-text") +
                      (validFirstName ? "" : "is-invalid")
                    }
                    id="firstName"
                    value={newFirstName}
                    onChange={(e) => handleFirstName(e.target.value)}
                    disabled={option != "users" || email == "admin"}
                  ></input>
                  {!validFirstName && (
                    <div className="invalid-feedback">Invalid first name</div>
                  )}
                </div>

                <div className="form-group col-sm-6">
                  <label
                    htmlFor="middleName"
                    className="small float-start text-muted"
                  >
                    Middle Name
                  </label>
                  <input
                    type="text"
                    className={
                      "form-control " +
                      (option == "users" && email != "admin"
                        ? ""
                        : "bg-white border-0 disabled-text") +
                      (validMiddleName ? "" : "is-invalid")
                    }
                    id="middleName"
                    value={newMiddleName}
                    onChange={(e) => handleMiddleName(e.target.value)}
                    disabled={option != "users" || email == "admin"}
                  ></input>
                  {!validMiddleName && (
                    <div className="invalid-feedback">Invalid middle name</div>
                  )}
                </div>

                <div className="form-group pb-3">
                  <label
                    htmlFor="lastName"
                    className="small float-start text-muted"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    className={
                      "form-control " +
                      (option == "users" && email != "admin"
                        ? ""
                        : "bg-white border-0 disabled-text") +
                      (validLastName ? "" : "is-invalid")
                    }
                    id="lastName"
                    value={newLastName}
                    onChange={(e) => handleLastName(e.target.value)}
                    disabled={option != "users" || email == "admin"}
                  ></input>
                  {!validLastName && (
                    <div className="invalid-feedback">Invalid last name</div>
                  )}
                </div>

                <div className="form-group pb-3">
                  <label
                    htmlFor="email"
                    className="small float-start text-muted"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control bg-white border-0 disabled-text"
                    id="email"
                    value={email}
                    disabled
                  ></input>
                </div>
              </form>
            </div>

            {toUpdate && (
              <div className="modal-footer justify-content-center">
                <p>
                  Type <b>&quot;{toUpdate}&quot;</b> below:
                </p>
                <input
                  className={
                    "form-control text-center " +
                    (validConfirmation ? "" : "is-invalid")
                  }
                  value={confirmAction}
                  onChange={(e) => {
                    setConfirmAction(e.target.value);
                  }}
                />
                {!validConfirmation && (
                  <div className="invalid-feedback">Invalid code</div>
                )}
                <small>
                  <button
                    type="button"
                    className={"btn " + styles.modalBtnGreen}
                    onClick={() => {
                      handleUpdateUser();
                    }}
                  >
                    CONFIRM ACTION
                  </button>
                </small>
              </div>
            )}

            {option == "users" && (
              <div className="modal-footer mt-3">
                {role !== "admin" && (
                  <button
                    type="button"
                    className={"btn " + styles.modalBtnRed}
                    onClick={() => {
                      setTransferStyles(true);
                      setConfirmAction("");
                      setValidConfirmation(true);
                      setToUpdate("delete user");
                    }}
                  >
                    DELETE USER
                  </button>
                )}
                <Link to={`../view-records?email=${email}`}>
                  <button
                    type="button"
                    className={"btn " + styles.modalBtnGreenNoOutline}
                    data-bs-dismiss="modal"
                    onClick={() => {}}
                  >
                    VIEW UPLOADS
                  </button>
                </Link>
                {email != "admin" ? (
                  <button
                    type="button"
                    className={
                      "btn " +
                      (transferStyles
                        ? styles.modalBtnGreenNoOutline
                        : styles.modalBtnGreen)
                    }
                    onClick={() => {
                      setTransferStyles(true);
                      setConfirmAction("");
                      setValidConfirmation(true);
                      setToUpdate("update user");
                    }}
                  >
                    SAVE CHANGES
                  </button>
                ) : null}
              </div>
            )}

            {toReg && (
              <div className="modal-footer justify-content-center">
                <p>
                  Type <b>&quot;{toReg}&quot;</b> below:
                </p>
                <input
                  className={
                    "form-control text-center " +
                    (validConfirmation ? "" : "is-invalid")
                  }
                  value={confirmAction}
                  onChange={(e) => {
                    setConfirmAction(e.target.value);
                  }}
                />
                {!validConfirmation && (
                  <div className="invalid-feedback">Invalid code</div>
                )}
                <small>
                  <button
                    type="button"
                    className={"btn " + styles.modalBtnGreen}
                    onClick={() => {
                      handleReg();
                    }}
                  >
                    CONFIRM ACTION
                  </button>
                </small>
              </div>
            )}

            {option == "reg" && (
              <div className="modal-footer mt-3">
                <button
                  type="button"
                  className={"btn " + styles.modalBtnRed}
                  onClick={() => {
                    setTransferStyles(true);
                    setConfirmAction("");
                    setValidConfirmation(true);
                    setToReg("decline registration");
                  }}
                >
                  DECLINE
                </button>
                <button
                  type="button"
                  className={
                    "btn " +
                    (transferStyles
                      ? styles.modalBtnGreenNoOutline
                      : styles.modalBtnGreen)
                  }
                  onClick={() => {
                    setTransferStyles(true);
                    setConfirmAction("");
                    setValidConfirmation(true);
                    setToReg("confirm registration");
                  }}
                >
                  CONFIRM
                </button>
              </div>
            )}

            {toDelReq && (
              <div className="modal-footer justify-content-center">
                <p>
                  Type <b>&quot;{toDelReq}&quot;</b> below:
                </p>
                <input
                  className={
                    "form-control text-center " +
                    (validConfirmation ? "" : "is-invalid")
                  }
                  value={confirmAction}
                  onChange={(e) => {
                    setConfirmAction(e.target.value);
                  }}
                />
                {!validConfirmation && (
                  <div className="invalid-feedback">Invalid code</div>
                )}
                <small>
                  <button
                    type="button"
                    className={"btn " + styles.modalBtnGreen}
                    onClick={() => {
                      handleDelReq();
                    }}
                  >
                    CONFIRM ACTION
                  </button>
                </small>
              </div>
            )}

            {toResetPW && (
              <div className="modal-footer justify-content-center">
                <p>
                  Create or&nbsp;
                  <a
                    href="#"
                    onClick={() => {
                      setPassword(passwordRandomizer());
                    }}
                  >
                    generate
                  </a>
                  &nbsp;a new password below:
                </p>
                <input
                  className={
                    "form-control text-center " +
                    (validConfirmation ? "" : "is-invalid")
                  }
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                {!validConfirmation && (
                  <div className="invalid-feedback">Invalid code</div>
                )}
                <small>
                  <button
                    type="button"
                    className={"btn " + styles.modalBtnGreen}
                    onClick={() => {
                      handleResetPassword();
                    }}
                  >
                    CONFIRM ACTION
                  </button>
                </small>
              </div>
            )}

            {option == "reset" && (
              <div className="modal-footer mt-3">
                <button
                  type="button"
                  className={"btn " + styles.modalBtnRed}
                  onClick={() => {
                    setToResetPW(false);
                    setTransferStyles(true);
                    setConfirmAction("");
                    setValidConfirmation(true);
                    setToDelReq("delete request");
                  }}
                >
                  DECLINE
                </button>
                <button
                  type="button"
                  className={
                    "btn " +
                    (transferStyles
                      ? styles.modalBtnGreenNoOutline
                      : styles.modalBtnGreen)
                  }
                  onClick={() => {
                    setToDelReq(null);
                    setTransferStyles(true);
                    setPassword("");
                    setValidConfirmation(true);
                    setToResetPW(true);
                  }}
                >
                  RESET
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={"btn p-3 borderRadius h-100 w-100 bg-white " + styles.card}
        type="button"
        data-bs-toggle="modal"
        data-bs-target={"#" + modalId}
        onClick={handleCloseModal}
      >
        <p className="font-weight-bold text-break">
          {firstName + " " + middleName + " "}
          <b>{lastName}</b>
        </p>
        <p className="text-muted text-break">{email}</p>
      </div>
    </div>
  );
};
