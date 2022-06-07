import { useState, useEffect } from "react";
import styles from "./ViewRecords.module.css";
import { Table } from "../../components/Table";
import { Taskbar } from "../../components/Taskbar";
import { apiUrl } from "../../utilities/apiUrl";
import { useLocation } from "react-router-dom";
import image from "../../assets/images/noDataFound.png";
import useAsyncState from "../../utilities/useAsyncState.js";
import { useSearchParams } from "react-router-dom";
import { ViewRecordsModal } from "../../components/ViewRecordsModal/ViewRecordsModal";

export const ViewRecords = () => {
  const pageSize = 20;
  const params = new URLSearchParams(window.location.search);
  const [searchParams, setSearchParams] = useSearchParams();
  const uploadId = params.get("upload_id");
  const [data, setData] = useState([]);
  const [paginatedData, setPaginatedData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [toPrint, setToPrint] = useAsyncState(false);
  const [toDel, setToDel] = useAsyncState([]);
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState(window.location.search);

  useEffect(() => {
    if (prevLocation !== location.search) {
      setPrevLocation(window.location.search);
      handleFetch();
    }
  });

  const removeDuplicates = (arr, key) => {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  };

  const handleFetch = () => {
    if (searchParams.get("email"))
      fetch(apiUrl(`/student/`), {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setData(
            removeDuplicates(
              data.filter((user) =>
                user["uploaderEmail"]
                  .toLowerCase()
                  .includes(searchParams.get("email").toLowerCase())
              ),
              "_id"
            )
          );
        });
    else
      fetch(
        uploadId === null
          ? apiUrl("/student/")
          : apiUrl("/student/?uploadId=" + uploadId),
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((temp) => {
          setData(
            temp.map((student, index) => ({
              ...student,
              checked: false,
            }))
          );
        })
        .catch((err) => {
          console.log(err);
        });
  };

  useEffect(() => {
    handleFetch();
  }, []);

  {
    /*Divide data into pageSize array */
  }
  useEffect(() => {
    if (data) {
      const index = (currentPage - 1) * pageSize;
      setPaginatedData(data.slice(index, index + pageSize));
    }
  }, [data]);

  {
    /* Change paginated data on page change*/
  }
  useEffect(() => {
    const index = (currentPage - 1) * pageSize;
    if (data) {
      setPaginatedData(data.slice(index, index + pageSize));
    }
  }, [currentPage]);

  {
    /* column headers*/
  }
  const column = [
    { text: "Email  ", dataField: "uploaderEmail" },
    { text: "Last Name  ", dataField: "lastName" },
    { text: "First Name  ", dataField: "firstName" },
    { text: "Degree", dataField: "Course" },
    { text: "GWA ", dataField: "GWA" },
  ];

  const pageCount = data ? Math.ceil(data.length / pageSize) : 0;
  const pages = Array(pageCount)
    .fill()
    .map((_, i) => i + 1);
  return (
    <div className={`${styles.App} container  `}>
      {/* Display viewRecords modal when isOpen is true*/}
      {isOpen && (
        <ViewRecordsModal
          setIsOpen={setIsOpen}
          setToDel={setToDel}
          toDel={toDel}
          setData={setData}
          data={data}
        />
      )}
      <div className={`row  ` + styles.viewRecords}>
        <div className="col-12">
          <Taskbar
            data={data}
            pageSize={pageSize}
            pages={pages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setData={setData}
            viewRecords={true}
            setIsOpen={setIsOpen}
            setToPrint={setToPrint}
            setToDel={setToDel}
          />
        </div>

        <div className="row">
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
                  className="rounded mx-auto w-auto  d-block img-fluid photo"
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
              <div className={`col-12`}>
                <Table
                  key="id"
                  paginatedData={paginatedData}
                  data={data}
                  setData={setData}
                  column={column}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  viewRecords={true}
                />
                <br />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
