import styles from "./StudentTableRow.module.css";

export const StudentTableRow = ({ item }) => {
  let semItems = [];
  let nCourseInSem = item["courseDetails"].length;
  let uniqueKey = 0;

  for (let i = 0; i < nCourseInSem; i++) {
    let rowItems = [];
    for (const [key, value] of Object.entries(item["courseDetails"][i])) {
      rowItems.push(
        <td key={uniqueKey} className={"px-lg-5 " + styles.tableRow}>
          {value}
        </td>
      );
      uniqueKey += 1;
    }
    if (i === 0) {
      rowItems.push(
        <td
          key={uniqueKey}
          className={styles.termCol + " px-lg-5 " + styles.tableRow}
          rowSpan={`${nCourseInSem}`}
        >
          <strong>Date:</strong> {item["date"]} <br />
          <strong>Total No. of Units:</strong> {item["units"]} <br />
          <strong>Running Sum:</strong> {item["runningSum"]}
        </td>
      );
    }
    semItems.push(
      <tr key={uniqueKey}>{rowItems.map((tdValue) => tdValue)}</tr>
    );
  }

  return semItems;
};
