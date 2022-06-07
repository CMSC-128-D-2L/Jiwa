import { useState, useEffect } from "react";
import { UserCard } from "../UserCard";
import { apiUrl } from "../../utilities/apiUrl";

export const PWReqsTab = ({ paginatedPWRequests, setPWRequests, setN }) => {
  return (
    <div className="row">
      {paginatedPWRequests.map((reqs, index) => (
        <UserCard
          key={index}
          index={index}
          option={"reset"}
          id={reqs.userReq._id}
          firstName={reqs.userReq.first_name}
          middleName={reqs.userReq.middle_name}
          lastName={reqs.userReq.last_name}
          email={reqs.userReq.email}
          role={reqs.userReq.role}
          requestId={reqs._id}
          set={setPWRequests}
          setN={setN}
        />
      ))}
    </div>
  );
};
