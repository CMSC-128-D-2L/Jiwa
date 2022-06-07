import styles from "./DashboardCard.module.css";
import { Link } from "react-router-dom";

export const DashboardCard = ({ icon, label, desc, btnLabel, link }) => {
  return (
    <div
      className={
        "d-flex flex-column justify-content-center align-items-center " +
        styles.dashboardCard
      }
    >
      <div className="pt-4">
        <i className={icon + " fs-1 " + styles.dashboardCardIcon} />
      </div>
      <div className="p-1">
        <h3 className={styles.dashboardCardLabel}>{label}</h3>
      </div>
      <div className="p-1">
        <p className={styles.dashboardCardDesc}>{desc}</p>
      </div>
      <div className="p-2 mt-auto">
        <Link to={link}>
          <button className={styles.dashboardCardButton} type="button">
            {btnLabel}
          </button>
        </Link>
      </div>
    </div>
  );
};
