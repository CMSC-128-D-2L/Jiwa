import styles from "./Dashboard.module.css";
import { DashboardCard } from "../../components/DashboardCard";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

export const Dashboard = () => {
  const UPLOAD_DESC =
    "Select from the different types of input files and upload the document to add student data into the system.";
  const VIEW_RECS_DESC =
    "Display, search, filter, or sort the summary of the records of all the students in the system. Includes the upload ID, Last Name, First Name, Degree, and GWA.";
  const EDIT_HIST_DESC =
    "See all the changes made in the records and the details such as who edited, whose record was changed, and a brief description about them.";
  const MANUAL_DESC =
    "Know more about the application and gain a comprehensive understanding of the how to's of the application such as navigation, file upload and record view/edit.";
  const USERMGT_DESC =
    "See the list of SHAC users, view their profiles, and manage user registration and user details.";
  const [email] = useOutletContext();

  return (
    <div className={styles.dashboardPage}>
      <div className="row">
        <div className="col-lg-4 col-md-6 col-sm-12">
          <DashboardCard
            icon="bi bi-cloud-arrow-up"
            label="Upload Documents"
            desc={UPLOAD_DESC}
            btnLabel="UPLOAD"
            link="/upload-docs"
          />
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12">
          <DashboardCard
            icon="bi bi-table"
            label="View All Records"
            desc={VIEW_RECS_DESC}
            btnLabel="BROWSE"
            link="/view-records"
          />
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12">
          <DashboardCard
            icon="bi bi-pencil-square"
            label="Edit History"
            desc={EDIT_HIST_DESC}
            btnLabel="VIEW"
            link="/edit-history"
          />
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12">
          <DashboardCard
            icon="bi bi-files"
            label="Manual"
            desc={MANUAL_DESC}
            btnLabel="READ"
            link="/manual"
          />
        </div>
        {email === "admin" ? (
          <div className="col-lg-4 col-md-6 col-sm-12">
            <DashboardCard
              icon="bi bi-gear"
              label="User Management"
              desc={USERMGT_DESC}
              btnLabel="MANAGE"
              link="/user-management"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
