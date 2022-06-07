import { useState, useEffect } from "react";
import { UserCard } from "../UserCard";
import { apiUrl } from "../../utilities/apiUrl";

export const RegistrationsTab = ({
  paginatedRegistrationRequests,
  setRegistrationRequests,
  setN,
}) => {
  return (
    <div className="row">
      {paginatedRegistrationRequests.map((reqs, index) => (
        <UserCard
          key={index}
          index={index}
          option={"reg"}
          id={reqs.userReq._id}
          firstName={reqs.userReq.first_name}
          middleName={reqs.userReq.middle_name}
          lastName={reqs.userReq.last_name}
          email={reqs.userReq.email}
          role={reqs.userReq.role}
          requestId={reqs._id}
          set={setRegistrationRequests}
          setN={setN}
        />
      ))}
    </div>
  );
};
