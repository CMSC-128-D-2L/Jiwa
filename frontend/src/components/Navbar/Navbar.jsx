import styles from "./Navbar.module.css";
import logo from "../../assets/images/jiwa-logo.png";
import logoFull from "../../assets/images/jiwa-full.png";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiUrl } from "../../utilities/apiUrl";

export const Navbar = ({ fName, lName, email }) => {
  const [activeLink, setActiveLink] = useState(window.location.pathname);
  const location = useLocation();

  useEffect(() => {
    if (activeLink !== location.pathname) {
      setActiveLink(window.location.pathname);
    }
  });

  const handleLogout = (e) => {
    e.preventDefault();

    fetch(apiUrl("/auth/"), {
      method: "DELETE",
      credentials: "include",
    })
      .then((response) => window.location.reload())
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <nav
      className={
        "navbar navbar-expand-md navbar-dark px-4 py-1 sticky-top " +
        styles.navbar
      }
    >
      <div className="container-fluid">
        <span className="navbar-brand">
          <Link to="/dashboard">
            <img src={logo} className="d-print-none" alt="jiwa short logo" />
          </Link>
        </span>
        <div className="d-none d-print-inline">
          <img src={logoFull} alt="jiwa full logo" />
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mx-auto mb-2 mb-md-0">
            {window.location.pathname != "/dashboard" ? (
              <div className="d-md-flex text-md-center">
                <li className="nav-item pe-3">
                  <Link
                    to="/upload-docs"
                    className={
                      "nav-link lh-1 " +
                      (activeLink == "/upload-docs" ? "active" : "")
                    }
                    onClick={() => {
                      setActiveLink("/upload-docs");
                    }}
                  >
                    <i className="bi bi-cloud-arrow-up fs-4 d-none d-md-block"></i>
                    <span className={styles.smallText}>Upload</span>
                  </Link>
                </li>
                <li className="nav-item pe-3">
                  <Link
                    to="/view-records"
                    className={
                      "nav-link lh-1 " +
                      (activeLink == "/view-records" ? "active" : "")
                    }
                    onClick={() => {
                      setActiveLink("/view-records");
                    }}
                  >
                    <i className="bi bi-table fs-4 d-none d-md-block"></i>
                    <span className={styles.smallText}>Records</span>
                  </Link>
                </li>
                <li className="nav-item pe-3">
                  <Link
                    to="/edit-history"
                    className={
                      "nav-link lh-1 " +
                      (activeLink == "/edit-history" ? "active" : "")
                    }
                    onClick={() => {
                      setActiveLink("/edit-history");
                    }}
                  >
                    <i className="bi bi-pencil-square fs-4 d-none d-md-block"></i>
                    <span className={styles.smallText}>History</span>
                  </Link>
                </li>
                <li className="nav-item pe-3">
                  <Link
                    to="/manual"
                    className={
                      "nav-link lh-1 " +
                      (activeLink == "/manual" ? "active" : "")
                    }
                    onClick={() => {
                      setActiveLink("/manual");
                    }}
                  >
                    <i className="bi bi-files fs-4 d-none d-md-block"></i>
                    <span className={styles.smallText}>Manual</span>
                  </Link>
                </li>
                {email === "admin" ? (
                  <li className="nav-item">
                    <Link
                      to="/user-management"
                      className={
                        "nav-link lh-1 " +
                        (activeLink == "/user-management" ? "active" : "")
                      }
                      onClick={() => {
                        setActiveLink("/user-management");
                      }}
                    >
                      <i className="bi bi-gear fs-4 d-none d-md-block"></i>
                      <span className={styles.smallText}>Manage</span>
                    </Link>
                  </li>
                ) : null}
                <div className="d-md-none dropdown-divider"></div>
              </div>
            ) : (
              <div></div>
            )}
            <div className="d-md-none">
              <li className="nav-item">
                <Link
                  to="/dashboard"
                  className={
                    "nav-link " + (activeLink == "/dashboard" ? "active" : "")
                  }
                  onClick={() => {
                    setActiveLink("/dashboard");
                  }}
                >
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/edit-profile"
                  className={
                    "nav-link " +
                    (activeLink == "/edit-profile" ? "active" : "")
                  }
                  onClick={() => {
                    setActiveLink("/edit-profile");
                  }}
                >
                  Edit Profile
                </Link>
              </li>
              <div className="dropdown-divider"></div>
              <li className="nav-item">
                <a className="nav-link" onClick={handleLogout}>
                  Log Out
                </a>
              </li>
            </div>
          </ul>
          <div className="dropdown d-none d-md-block">
            <button
              className="btn btn-light dropdown-toggle rounded-pill"
              type="button"
              id="profileMenu"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span data-initials={fName[0] + lName[0]}></span>
              {fName}
            </button>
            <ul
              className={
                "dropdown-menu dropdown-menu-md-end shadow border-0 mt-2 borderRadius secondaryText " +
                styles.dropdown +
                styles.smallText
              }
              aria-labelledby="profileMenu"
            >
              <li className="dropdown-header text-center py-3">
                <span className="text-dark fs-6">{fName + " " + lName}</span>
                <br />
                <small>{email}</small>
              </li>
              <div className="dropdown-divider"></div>
              <li>
                <Link to="/dashboard" className="dropdown-item">
                  <i className="bi bi-columns-gap pe-3"></i>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/edit-profile"
                  className="dropdown-item"
                  onClick={() => {
                    setActiveLink("/edit-profile");
                  }}
                >
                  <i className="bi bi-pencil pe-3"></i>
                  Edit Profile
                </Link>
              </li>
              <div className="dropdown-divider"></div>
              <li>
                <a className="dropdown-item text-danger" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-left pe-3"></i>
                  Log Out
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};
