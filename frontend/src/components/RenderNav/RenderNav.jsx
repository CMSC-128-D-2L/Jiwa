import { Outlet, Navigate } from "react-router-dom";
import { Navbar } from "../Navbar";
import { useState, useEffect } from "react";
import { apiUrl } from "../../utilities/apiUrl";

export const RenderNav = () => {
  const [checkedIfLoggedIn, setCheckedIfLoggedIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    fetch(apiUrl("/auth/"), {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setCheckedIfLoggedIn(true);
        if (data.User) {
          setFirstName(data.User.first_name);
          setLastName(data.User.last_name);
          setUserEmail(data.User.email);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  return checkedIfLoggedIn ? (
    isLoggedIn ? (
      <div>
        <Navbar fName={firstName} lName={lastName} email={userEmail} />
        <Outlet context={[userEmail]} />
      </div>
    ) : (
      <Navigate to="/" />
    )
  ) : (
    <div></div>
  );
};
