import { useState, useEffect } from "react";
import { UserCard } from "../UserCard";
import { apiUrl } from "../../utilities/apiUrl";

export const UsersTab = ({ paginatedUsers, setUsers, setN }) => {
  return (
    <div className="row">
      {paginatedUsers.map((user, index) => (
        <UserCard
          key={index}
          index={index}
          option={"users"}
          id={user._id}
          firstName={user.first_name}
          middleName={user.middle_name}
          lastName={user.last_name}
          email={user.email}
          role={user.role}
          requestId={null}
          set={setUsers}
          setN={setN}
        />
      ))}
    </div>
  );
};
