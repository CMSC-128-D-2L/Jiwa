import styles from "./UserManagement.module.css";
import { useState, useRef, useEffect } from "react";
import { Link, Navigate, useOutletContext } from "react-router-dom";
import useAsyncState from "../../utilities/useAsyncState.js";
import { toTitleCase } from "../../utilities/inputVerification.js";
import { apiUrl } from "../../utilities/apiUrl";
import { UsersTab } from "../../components/UsersTab";
import { RegistrationsTab } from "../../components/RegistrationsTab";
import { PWReqsTab } from "../../components/PWReqsTab";

export const UserManagement = () => {
  const pageSize = 4;
  const [users, setUsers] = useState([]);
  const [paginatedUsers, setPaginatedUsers] = useState([]);
  const [PWRequests, setPWRequests] = useState([]);
  const [paginatedPWRequests, setPaginatedPWRequests] = useState([]);
  const [registrationRequests, setRegistrationRequests] = useState([]);
  const [paginatedRegistrationRequests, setPaginatedRegistrationRequests] =
    useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [usersN, setUsersN] = useState(0);
  const [regN, setRegN] = useState(0);
  const [pwN, setPwn] = useState(0);
  const [activeLink, setActiveLink] = useState("users");

  const [email] = useOutletContext();
  const [checkedIfAdmin, setCheckedIfAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [pages, setPages] = useState([]);

  useEffect(() => {
    if (email === "admin") setIsAdmin(true);
    else setIsAdmin(false);

    setCheckedIfAdmin(true);
  });

  const removeDuplicates = (arr, key) => {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  };

  const fetchUsers = () => {
    fetch(apiUrl(`/user/?sortby=last_name`), {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.User);
        setUsersN(data.User.length);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchPWRequests = () => {
    fetch(apiUrl(`/message/?reqType=edit`), {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPWRequests(data.Messages);
        setPwn(data.Messages.length);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchRegRequests = () => {
    fetch(apiUrl(`/message/?reqType=create`), {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setRegistrationRequests(data.Messages);
        setRegN(data.Messages.length);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const searchUser = () => {
    if (search !== "") {
      fetch(apiUrl(`/user/`), {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUsers(
            removeDuplicates(
              data.User.filter(
                (user) =>
                  user.first_name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  user.last_name.toLowerCase().includes(search.toLowerCase()) ||
                  user.email.toLowerCase().includes(search.toLowerCase()) ||
                  (user.first_name + " " + user.last_name)
                    .toLowerCase()
                    .includes(search.toLowerCase())
              ),
              "_id"
            )
          );
        });
    } else {
      fetch(apiUrl(`/user/`), {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUsers(data.User);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const searchPWRequests = () => {
    if (search !== "") {
      fetch(apiUrl(`/message/?reqType=edit`), {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setRegistrationRequests(
            removeDuplicates(
              data.Messages.filter(
                (user) =>
                  user.userReq.first_name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  user.userReq.last_name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  user.userReq.email
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  (user.userReq.first_name + " " + user.userReq.last_name)
                    .toLowerCase()
                    .includes(search.toLowerCase())
              ),
              "_id"
            )
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } else
      fetch(apiUrl(`/message/?reqType=edit`), {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setRegistrationRequests(data.Messages);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const searchRegRequests = () => {
    if (search !== "") {
      fetch(apiUrl(`/message/?reqType=create`), {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setRegistrationRequests(
            removeDuplicates(
              data.Messages.filter(
                (user) =>
                  user.userReq.first_name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  user.userReq.last_name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  user.userReq.email
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  (user.userReq.first_name + " " + user.userReq.last_name)
                    .toLowerCase()
                    .includes(search.toLowerCase())
              ),
              "_id"
            )
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } else
      fetch(apiUrl(`/message/?reqType=create`), {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setRegistrationRequests(data.Messages);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const refreshPages = () => {
    let pages =
      activeLink === "users"
        ? users
          ? Math.ceil(users.length / pageSize)
          : 0
        : activeLink === "pw"
        ? PWRequests
          ? Math.ceil(PWRequests.length / pageSize)
          : 0
        : activeLink === "reg"
        ? registrationRequests
          ? Math.ceil(registrationRequests.length / pageSize)
          : 0
        : 0;
    setPages(
      Array(pages)
        .fill()
        .map((_, i) => i + 1)
    );
  };

  // let pageCount =
  //   activeLink === "users"
  //     ? users
  //       ? Math.ceil(users.length / pageSize)
  //       : 0
  //     : activeLink === "pw"
  //     ? PWRequests
  //       ? Math.ceil(PWRequests.length / pageSize)
  //       : 0
  //     : activeLink === "reg"
  //     ? registrationRequests
  //       ? Math.ceil(registrationRequests.length / pageSize)
  //       : 0
  //     : 0;
  // let pages = Array(pageCount)
  //   .fill()
  //   .map((_, i) => i + 1);

  const getViewablePages = () => {
    let viewablePages;
    if (currentPage === pages[0] && pages.length >= 3) {
      viewablePages = pages.slice(0, 3);
    } else if (currentPage === pages[pages.length - 1] && pages.length >= 3) {
      viewablePages = pages.slice(pages.length - 3, pages.length);
    } else if (
      (currentPage === pages[0] && pages.length < 3) ||
      (currentPage === pages[pages.length - 1] && pages.length < 3)
    ) {
      viewablePages = pages.slice(0, pages.length);
    } else if (pages.length == 0) {
      viewablePages = [1];
    } else {
      viewablePages = pages.slice(currentPage - 2, currentPage + 1);
    }
    return viewablePages;
  };

  useEffect(() => {
    fetchPWRequests();
    fetchUsers();
    fetchRegRequests();
  }, []);

  return checkedIfAdmin ? (
    isAdmin ? (
      <div className="container">
        <h1 className="text-center p-5 m-0">
          <b>User Management</b>
        </h1>
        <div>
          <ul className="nav nav-pills border-0">
            <li className="nav-item">
              <Link
                className={
                  "nav-link " +
                  (activeLink == "users"
                    ? styles.activeNav + " active"
                    : "text-muted")
                }
                to="#"
                onClick={() => {
                  fetchUsers();
                  setActiveLink("users");
                  refreshPages();
                  setCurrentPage(1);
                }}
              >
                {"SHAC Users" + (usersN > 0 ? " (" + usersN + ")" : "")}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  "nav-link " +
                  (activeLink == "reg"
                    ? styles.activeNav + " active"
                    : "text-muted")
                }
                to="#"
                onClick={() => {
                  fetchRegRequests();
                  setActiveLink("reg");
                  refreshPages();
                  setCurrentPage(1);
                }}
              >
                {"Registrations" + (regN > 0 ? " (" + regN + ")" : "")}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  "nav-link " +
                  (activeLink == "pw"
                    ? styles.activeNav + " active"
                    : "text-muted")
                }
                to="#"
                onClick={() => {
                  fetchPWRequests();
                  setActiveLink("pw");
                  refreshPages();
                  setCurrentPage(1);
                }}
              >
                {"Reset Requests" + (pwN > 0 ? " (" + pwN + ")" : "")}
              </Link>
            </li>
          </ul>
          <div className="row mt-4 pb-4">
            <div className="input-group col">
              <input
                type="search"
                placeholder="Search"
                className={`form-control border-end-0 rounded-pill rounded-end `}
                id="search"
                value={search}
                onChange={(e) => setSearch(toTitleCase(e.target.value))}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    if (activeLink === "users") searchUser();
                    else if (activeLink === "pw") searchPWRequests();
                    else if (activeLink === "reg") searchRegRequests();
                  }
                }}
              ></input>
              <span
                className={`input-group-text bg-white p-0 rounded-start border-start-0 rounded-pill rounded"
                }`}
              >
                <div className={"btn py-1 px-2 rounded-pill "}>
                  <i
                    className="bi bi-search rounded-pill"
                    onClick={() => {
                      if (activeLink === "users") searchUser();
                      else if (activeLink === "pw") searchPWRequests();
                      else if (activeLink === "reg") searchRegRequests();
                    }}
                  ></i>
                </div>
              </span>
            </div>
            {/* Start of Pagination */}
            <div className="col-12 col-sm-4 col-md-3 col-lg-2">
              <nav aria-label="h-50 Page navigation example">
                <ul className={` pagination mt-1 mb-2`}>
                  <li
                    className={`${
                      pages[0] === currentPage
                        ? `page-item disabled`
                        : `page-item`
                    }`}
                  >
                    <p
                      className={`page-link ${styles.pageLink}`}
                      onClick={() => setCurrentPage(1)}
                    >
                      &laquo;
                    </p>
                  </li>
                  {getViewablePages().map((page, index) => (
                    <li
                      key={index}
                      className={`${
                        page === currentPage ? `page-item active ` : `page-item`
                      }`}
                    >
                      <p
                        className={`${
                          page === currentPage
                            ? `page-link ${styles.pageLink} ${styles.active}`
                            : `page-link ${styles.pageLink}`
                        }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </p>
                    </li>
                  ))}
                  <li
                    className={`${
                      pages[pages.length - 1] === currentPage
                        ? `page-item disabled `
                        : `page-item `
                    }`}
                  >
                    <p
                      className={`page-link ${styles.pageLink}`}
                      onClick={() => setCurrentPage(pages.length)}
                    >
                      &raquo;
                    </p>
                  </li>
                </ul>
              </nav>
            </div>
            {/*End of Pagination */}

            <div className="mt-4">
              {activeLink == "users" && (
                <UsersTab
                  paginatedUsers={users.slice(
                    (currentPage - 1) * pageSize,
                    (currentPage - 1) * pageSize + pageSize
                  )}
                  setUsers={setUsers}
                  setN={setUsersN}
                />
              )}
              {activeLink == "reg" && (
                <RegistrationsTab
                  paginatedRegistrationRequests={registrationRequests.slice(
                    (currentPage - 1) * pageSize,
                    (currentPage - 1) * pageSize + pageSize
                  )}
                  setRegistrationRequests={setRegistrationRequests}
                  setN={setRegN}
                />
              )}
              {activeLink == "pw" && (
                <PWReqsTab
                  paginatedPWRequests={PWRequests.slice(
                    (currentPage - 1) * pageSize,
                    (currentPage - 1) * pageSize + pageSize
                  )}
                  setPWRequests={setPWRequests}
                  setN={setPwn}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    ) : (
      <Navigate to="/" />
    )
  ) : (
    <div></div>
  );
};
