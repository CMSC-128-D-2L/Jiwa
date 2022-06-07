import styles from "./InconsistencyTable.module.css";

export const InconsistencyTable = ({ data, headers, onChange, deleteRow }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          {Object.keys(data[0]).map((columnName, i) => (
            <th key={i} scope="col">
              {headers[columnName]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr
            key={i}
            // show a thick line separator if row is sem summary (row w/ no course code)
            // highlight row in red if row is a required subject (units is inconsistent)
            className={
              (!row.courseCode.value ? styles.separatedRow : "") +
              (row.nUnits.isInconsistent ? "table-danger" : "")
            }
          >
            {row.courseCode.value === "AWOL" ||
            row.courseCode.value === "LOA" ? (
              <td colSpan={6}>
                <b>{row.courseCode.value}</b>
              </td>
            ) : (
              Object.values(row).map((entry, j) => {
                if (entry.value === null) return <td key={j}></td>;
                return (
                  <td className={styles.cell} key={j}>
                    <input
                      className={`${
                        styles.spawnTooltip
                      } form-control text-center ${
                        entry.isInconsistent && "is-invalid"
                      }`}
                      value={entry.value}
                      onChange={(e) =>
                        onChange(i, Object.keys(row)[j], {
                          value: e.target.value,
                          isInconsistent: false,
                        })
                      }
                    />
                    {entry.isInconsistent && (
                      <div className="invalid-tooltip">
                        {entry.isInconsistent}
                      </div>
                    )}
                  </td>
                );
              })
            )}
            {!row.semester.isSummary && (
              <td>
                {" "}
                <button
                  className="btn bi bi-trash text-danger rounded-pill"
                  onClick={() => {
                    deleteRow(i);
                  }}
                ></button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
