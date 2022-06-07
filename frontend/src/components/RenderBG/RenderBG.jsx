import styles from "./RenderBG.module.css";
import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiUrl } from "../../utilities/apiUrl";

export const RenderBG = () => {
  const [checkedIfLoggedIn, setCheckedIfLoggedIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch(apiUrl("/auth/"), {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setCheckedIfLoggedIn(true);
        data.User ? setIsLoggedIn(true) : setIsLoggedIn(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  return checkedIfLoggedIn ? (
    isLoggedIn ? (
      <div>
        <Navigate to="/dashboard" />
      </div>
    ) : (
      <div>
        <div className={styles.bg}></div>
        <Outlet />
      </div>
    )
  ) : (
    <div></div>
  );
};
