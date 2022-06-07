import styles from "./EditHistory.module.css";
import { Table } from "../../components/Table";
import { Taskbar } from "../../components/Taskbar";
import { useState, useEffect } from "react";
import { apiUrl } from "../../utilities/apiUrl";
import image from "../../assets/images/noDataFound.png";
import useAsyncState from "../../utilities/useAsyncState.js";

export const EditHistory = () => {
  const pageSize = 15;
  const [data, setData] = useState([]);
  const [paginatedData, setPaginatedData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [toPrint, setToPrint] = useAsyncState(false);
  const [toDel, setToDel] = useAsyncState([]);
  useEffect(() => {
    fetch(apiUrl("/student/edits"), {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((temp) => {
        setData(
          temp.map((student, index) => ({
            ...student,
            id: index++,
          }))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (data) {
      const index = (currentPage - 1) * pageSize;
      setPaginatedData(data.slice(index, index + pageSize));
    }
  }, [data]);
  useEffect(() => {
    const index = (currentPage - 1) * pageSize;
    if (data) {
      setPaginatedData(data.slice(index, index + pageSize));
    }
  }, [currentPage]);

  const column = [
    { text: "Date and Time", dataField: "createdAt" },
    { text: "Editor", dataField: "userEmail" },
    { text: "Student Record ", dataField: "studentFullName" },
    { text: "Description", dataField: "description" },
  ];

  const pageCount = data ? Math.ceil(data.length / pageSize) : 0;
  const pages = Array(pageCount)
    .fill()
    .map((_, i) => i + 1);
  return (
    <div className={`${styles.App} container `}>
      <div className={`row ` + styles.viewRecords}>
        <div className="col-12">
          <Taskbar
            data={data}
            pageSize={pageSize}
            pages={pages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setData={setData}
            viewRecords={false}
            setToPrint={setToPrint}
            setToDel={setToDel}
          />
        </div>

        <div className={`row  `}>
          {!paginatedData || paginatedData.length == 0 ? (
            <div
              className={
                `col-12 d-flex justify-content-center align-items-center ` +
                styles.viewRecords
              }
            >
              <div className="">
                <img
                  src={image}
                  className="rounded mx-auto w-auto d-block img-fluid photo"
                  alt="..."
                />
                <div>No data found</div>
              </div>
            </div>
          ) : (
            <div
              className={
                toPrint === false
                  ? "overflow-auto row " + styles.table
                  : styles.table
              }
            >
              <div className={"col-12"}>
                <Table
                  key="id"
                  paginatedData={paginatedData}
                  data={data}
                  setData={setData}
                  column={column}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  viewRecords={false}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
