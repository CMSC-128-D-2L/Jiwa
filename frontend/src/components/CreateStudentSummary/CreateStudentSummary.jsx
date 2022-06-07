import styles from "./CreateStudentSummary.module.css";

export const CreateStudentSummary = ({
  GWA,
  totalUnits,
  totalRunningSum,
  reqUnits,
  notes,
  setNotes,
  column,
  studentData,
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

  const handleNotes = (e) => {
    setNotes(e.target.value);
  };

  const TableHeadItem = ({ item }) => <th className="px-lg-5">{item.text}</th>;
  const forLoopIfEmpty = [1, 2, 3, 4];

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
          {studentData.length > 0 ? (
            tableData.map((item, index) => (
              <TableRowView
                item={item}
                key={index}
                column={column}
                index={index}
              />
            ))
          ) : (
            <tr>
              {forLoopIfEmpty.map((value) => {
                if (value == forLoopIfEmpty.length) {
                  return (
                    <td className={"px-lg-5 " + styles.tableRow} key={value}>
                      <input
                        className={styles.editFieldNumber}
                        type="number"
                        value={reqUnits}
                        onChange={handleReqUnits}
                      ></input>
                    </td>
                  );
                } else {
                  return (
                    <td
                      key={value}
                      className={"px-lg-5 py-lg-2 " + styles.tableRow}
                    >
                      ---
                    </td>
                  );
                }
              })}
            </tr>
          )}
          <tr>
            <td className="px-lg-5 py-lg-4" colSpan={4}>
              <strong>Remarks: </strong>
              <input
                className={styles.editNotes}
                type="text"
                value={notes}
                onChange={(e) => handleNotes(e)}
              ></input>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
