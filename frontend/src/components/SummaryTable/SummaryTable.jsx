import styles from "./SummaryTable.module.css";

export const SummaryTable = ({
  GWA,
  totalUnits,
  totalRunningSum,
  reqUnits,
  notes,
  column,
  handleReqUnits,
}) => {
  const tableData = [
    {
      GWA: parseFloat(GWA).toFixed(4),
      totalUnits,
      totalRunningSum,
      reqUnits,
    },
  ];

  const TableHeadItem = ({ item }) => <th className="px-lg-5">{item.text}</th>;

  const TableRowView = ({ item, column }) => (
    <tr>
      {column.map((columnItem, index) => {
        if (columnItem.text == "Required No. of Units") {
          return (
            <td className={"px-lg-5 " + styles.tableRow} key={index}>
              <input
                className={styles.editFieldNumber}
                type="number"
                value={item["reqUnits"]}
                onChange={handleReqUnits}
              ></input>
            </td>
          );
        } else if (columnItem.text == "Total No. of Units") {
          if (item["totalUnits"] < item["reqUnits"]) {
            return (
              <td className={"px-lg-5 " + styles.tableRow} key={index}>
                <div className={styles.editFieldNumberError}>
                  {item[`${columnItem.dataField}`]}
                </div>
              </td>
            );
          } else {
            return (
              <td className={"px-lg-5 " + styles.tableRow} key={index}>
                {item[`${columnItem.dataField}`]}
              </td>
            );
          }
        } else {
          return (
            <td className={"px-lg-5 " + styles.tableRow} key={index}>
              {item[`${columnItem.dataField}`]}
            </td>
          );
        }
      })}
    </tr>
  );

  return (
    <div>
      <table
        className={"table borderRadius "}
        id={styles.table}
        cellSpacing="0"
        width="100%"
      >
        <thead>
          <tr>
            {column.map((item, index) => (
              <TableHeadItem key={index} item={item} />
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, index) => (
            <TableRowView
              item={item}
              key={index}
              column={column}
              index={index}
            />
          ))}
          <tr>
            <td className="px-lg-5 py-lg-4" colSpan={4}>
              <strong>Remarks: </strong>
              {notes}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
