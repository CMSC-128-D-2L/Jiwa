import styles from "./Table.module.css";
import { Link } from "react-router-dom";

export const Table = ({
  paginatedData,
  data,
  setData,
  column,
  pageSize,
  currentPage,
  viewRecords,
}) => {
  //Changes checked field in student object
  const handleChange = (index) => {
    index += (currentPage - 1) * pageSize;
    data[index].checked = !data[index].checked;
    setData(data);
    document.getElementsByClassName("topmostCheckbox")[0].checked = false;
  };

  //for check all checkbox at the top of the table
  const checkall = () => {
    const checkbox = document.getElementsByClassName("topmostCheckbox");
    const array = document.getElementsByClassName("otherCheckbox");
    for (let i = 0; i < array.length; i++) {
      array[i].checked = checkbox[0].checked;
      data[i].checked = checkbox[0].checked;
      setData(data);
    }
  };

  const TableHeadItem = ({ item }) => (
    <th className={item.dataField === "uploadId" ? styles.noPrint : ""}>
      {item.text}
    </th>
  );

  const TableRow = ({ item, column, index }) => (
    <tr>
      {viewRecords == true ? (
        <td className={`` + styles.noPrint}>
          <input
            className="form-check-input otherCheckbox checkbox"
            type="checkbox"
            id="flexCheckDefault"
            onClick={() => {
              handleChange(index);
            }}
          />
        </td>
      ) : (
        ""
      )}
      {column.map((columnItem, index) => {
        return (
          <td
            key={index}
            className={`
              ${
                columnItem.dataField === "uploadId" //exclude uploadId from print
                  ? styles.noPrint + " " + styles.maxwidth
                  : ""
              } ${columnItem.dataField === "description" ? styles.maxwidth : ""}
             `} //limit width of description
          >
            <p
              className={
                columnItem.dataField === "uploadId"
                  ? "text-truncate"
                  : "" + `m-0 `
              }
            >
              {columnItem.dataField === "studentFullName" &&
              item.studentId !== null
                ? typeof item.studentId.firstName === "string" || //remove double quotes from all string data
                  typeof item.studentId.firstName instanceof String
                  ? (
                      item.studentId.firstName +
                      " " +
                      item.studentId.lastName
                    ).replaceAll(`\"`, "")
                  : item.studentId.firstName + " " + item.studentId.lastName
                : columnItem.dataField === "studentFullName" &&
                  item.studentId === null
                ? typeof item.studentFirstName === "string" || //remove double quotes from all string data
                  typeof item.studentFirstName instanceof String
                  ? (
                      item.studentFirstName +
                      " " +
                      item.studentLastName
                    ).replaceAll(`\"`, "")
                  : item.studentFirstName + " " + item.studentLastName
                : typeof item[`${columnItem.dataField}`] === "string" || //remove double quotes from all string data
                  typeof item[`${columnItem.dataField}`] instanceof String
                ? item[`${columnItem.dataField}`].replaceAll(`\"`, "")
                : item[`${columnItem.dataField}`]}
            </p>
          </td>
        );
      })}
      {viewRecords == true ? (
        <td className={`` + styles.noPrint}>
          <Link to={`../student-record?id=${item._id}`}>
            {" "}
            {/*redirect to student record page in view button*/}
            <button type="button" className={`btn ${styles.viewButton}`}>
              VIEW
            </button>
          </Link>
        </td>
      ) : (
        ""
      )}
    </tr>
  );
  return (
    <div className="table-responsive">
      <table
        id="dtBasicExample"
        className={`table  ${styles.table}`}
        cellSpacing="0"
        width="100%"
      >
        <thead>
          <tr>
            {viewRecords == true ? (
              <td className={`` + styles.noPrint}>
                {" "}
                {/* exclude checkbox from print and edit history*/}
                <input
                  className="form-check-input topmostCheckbox checkbox"
                  type="checkbox"
                  id="flexCheckDisabled checkall"
                  onClick={() => checkall(this)}
                />
              </td>
            ) : (
              ""
            )}
            {column.map((item, index) => (
              <TableHeadItem key={index} item={item} />
            ))}
            {viewRecords == true ? (
              <td className={`` + styles.noPrint}>
                {" "}
                {/* exclude viewbutton from print and edit history */}
                <span></span>
              </td>
            ) : (
              ""
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <TableRow
              item={item}
              key={index}
              column={column}
              index={index}
              className={styles.printStyle}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
