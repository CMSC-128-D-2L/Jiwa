import styles from "./Taskbar.module.css";
import { useEffect, useState } from "react";
import { apiUrl } from "../../utilities/apiUrl";
import useAsyncState from "../../utilities/useAsyncState.js";
import { toTitleCase } from "../../utilities/inputVerification.js";
import { useSearchParams } from "react-router-dom";

export const Taskbar = ({
  data,
  pageSize,
  pages,
  currentPage,
  setCurrentPage,
  setData,
  viewRecords,
  setIsOpen,
  setToPrint,
  setToDel,
}) => {
  const [text, setText] = useAsyncState("");
  const [min, setMin] = useAsyncState("");
  const [max, setMax] = useAsyncState("");
  const [filter, setFilter] = useAsyncState(0);
  const [sort, setSort] = useAsyncState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const endpoint = viewRecords ? "/student/" : "/student/edits/";
  const choices = viewRecords
    ? ["None", "First Name", "Last Name", "Degree", "Email", "GWA"]
    : ["None", "Student FName", "Student LName", "Email"];
  const query = viewRecords
    ? ["None", "firstName", "lastName", "Course", "uploaderEmail", "GWA"]
    : ["None", "studentFirstName", "studentLastName", "userEmail"];

  const sortQuery = [
    "None",
    "studentFirstName",
    "studentLastName",
    "userEmail",
  ];

  {
    /* Set default minimum page count as 1*/
  }
  useEffect(() => {
    if (data) {
      if (data[(currentPage - 1) * pageSize]) {
        setCurrentPage(currentPage);
      } else {
        if (currentPage - 1 == 0) setCurrentPage(currentPage);
        else setCurrentPage(currentPage - 1);
      }
    }
  }, [data]);

  //summon viewRecordsModal
  const deleteData = async () => {
    const toBeDeleted = data.filter((row) => row.checked == true);
    if (toBeDeleted.length != 0) await setToDel(toBeDeleted);
    else await setToDel([]);
    setIsOpen(true);
    document.getElementsByClassName("topmostCheckbox")[0].checked = false;
  };

  //limit number of pagination displayed
  const getViewablePages = () => {
    let viewablePages;
    if (currentPage === pages[0] && pages.length >= 3) {
      viewablePages = pages.slice(0, 3);
    } else if (currentPage === pages[pages.length - 1] && pages.length >= 3) {
      viewablePages = pages.slice(pages.length - 3, pages.length);
    } else if (
      (currentPage === pages[0] && pages.length < 3) ||
      (currentPage === pages[pages.length - 1] && pages.length < 3)
    ) {
      viewablePages = pages.slice(0, pages.length);
    } else if (pages.length == 0) {
      pages = [1];
      viewablePages = pages;
    } else {
      viewablePages = pages.slice(currentPage - 2, currentPage + 1);
    }

    return viewablePages;
  };

  const removeDuplicates = (arr, key) => {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  };

  //Filter data when searchbar is not empty
  const fetchFilterData = (currentDropdown) => {
    if (text !== "" && text !== undefined) {
      if (currentDropdown !== 0 && sort !== 0) {
        // If both sort and filter are selected
        // Selected Selected Occupied
        fetch(
          apiUrl(
            `${endpoint}?${query[currentDropdown]}=${text}&sortby=${query[sort]}`
          ),
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            setData(data);
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (currentDropdown !== 0 && sort === 0) {
        // If only filter is selected
        // Selected Deselected Occupied
        fetch(apiUrl(`${endpoint}?${query[currentDropdown]}=${text}`), {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setData(data);
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (currentDropdown === 0 && sort !== 0) {
        // If filter is deselected while sort is selected
        // Deselected Selected Occupied
        // Grab all matches
        if (viewRecords) {
          fetch(apiUrl(`${endpoint}`), {
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
                  data.filter(
                    (user) =>
                      user[query[1]]
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      user[query[2]]
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      user[query[3]]
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      user[query[4]]
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      (user[query[1]] + " " + user[query[2]])
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      (user[query[2]] + " " + user[query[1]])
                        .toLowerCase()
                        .includes(text.toLowerCase())
                  ),
                  viewRecords ? "_id" : "_id"
                ).sort((a, b) => {
                  if (
                    typeof a[query[sort]] == "string" ||
                    a[query[sort]] instanceof String
                  ) {
                    const nameA = a[query[sort]].toUpperCase();
                    const nameB = b[query[sort]].toUpperCase();
                    if (nameA < nameB) {
                      return -1;
                    }
                    if (nameA > nameB) {
                      return 1;
                    }
                    return 0;
                  } else if (
                    typeof a[query[sort]] == "number" ||
                    a[query[sort]] instanceof Number
                  ) {
                    return a[query[sort]] - b[query[sort]];
                  }
                })
              );
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          fetch(apiUrl(`${endpoint}`), {
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
                  data.filter(
                    (user) =>
                      user[sortQuery[1]]
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      user[sortQuery[2]]
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      user[sortQuery[3]]
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      (user[sortQuery[1]] + " " + user[sortQuery[2]])
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      (user[sortQuery[2]] + " " + user[sortQuery[1]])
                        .toLowerCase()
                        .includes(text.toLowerCase())
                  ),
                  viewRecords ? "_id" : "_id"
                ).sort((a, b) => {
                  if (
                    typeof a[sortQuery[sort]] == "string" ||
                    a[sortQuery[sort]] instanceof String
                  ) {
                    const nameA = a[sortQuery[sort]].toUpperCase();
                    const nameB = b[sortQuery[sort]].toUpperCase();
                    if (nameA < nameB) {
                      return -1;
                    }
                    if (nameA > nameB) {
                      return 1;
                    }
                    return 0;
                  } else if (
                    typeof a[sortQuery[sort]] == "number" ||
                    a[sortQuery[sort]] instanceof Number
                  ) {
                    return a[sortQuery[sort]] - b[sortQuery[sort]];
                  }
                })
              );
            });
        }
      } else if (currentDropdown === 0 && sort === 0) {
        // If filter is deselected while sort is deselected
        // Deselected Deselected Occupied
        // Grab matches from all fields
        if (viewRecords) {
          fetch(apiUrl(`${endpoint}`), {
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
                  data.filter(
                    (user) =>
                      user[query[1]]
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      user[query[2]]
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      user[query[3]]
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      user[query[4]]
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      (user[query[1]] + " " + user[query[2]])
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      (user[query[2]] + " " + user[query[1]])
                        .toLowerCase()
                        .includes(text.toLowerCase())
                  ),
                  viewRecords ? "_id" : "_id"
                )
              );
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          fetch(apiUrl(`${endpoint}`), {
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
                  data.filter(
                    (user) =>
                      user[sortQuery[1]]
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      user[sortQuery[2]]
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      user[sortQuery[3]]
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      (user[sortQuery[1]] + " " + user[sortQuery[2]])
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      (user[sortQuery[2]] + " " + user[sortQuery[1]])
                        .toLowerCase()
                        .includes(text.toLowerCase())
                  ),
                  viewRecords ? "_id" : "_id"
                )
              );
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    } else {
      if (
        (currentDropdown === 0 && sort !== 0) ||
        (currentDropdown !== 0 && sort !== 0)
      ) {
        // Filter is deselected
        // Deselected Selected Empty
        // Selected Selected Empty
        fetch(apiUrl(`${endpoint}?sortby=${query[sort]}`), {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setData(data);
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (
        (currentDropdown !== 0 && sort === 0) ||
        (currentDropdown === 0 && sort === 0)
      ) {
        // Get all no query
        // Selected Deselected Empty
        // Deselected Deselected Empty
        fetch(apiUrl(`${endpoint}`), {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setData(data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  const fetchSortData = (currentDropdown) => {
    if (searchParams.get("upload_id")) {
      //sort only newly uploaded students
      fetch(
        apiUrl(
          `${endpoint}?uploadId=${searchParams.get("upload_id")}&sortby=${
            query[currentDropdown]
          }`
        ),
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setData(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (searchParams.get("email")) {
      //sort only view email students
      fetch(apiUrl(`${endpoint}?sortby=${query[currentDropdown]}`), {
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
                user[query[4]]
                  .toLowerCase()
                  .includes(searchParams.get("email").toLowerCase())
              ),
              viewRecords ? "_id" : "_id"
            )
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (filter !== 0 && currentDropdown !== 0 && text !== "") {
      // If both sort and filter are selected
      // Selected Selected Occupied
      fetch(
        query[filter] === "GWA"
          ? apiUrl(
              `${endpoint}?min=${min === "" ? 1 : min}&max=${
                max === "" ? 5 : max
              }&sortby=${query[currentDropdown]}`
            )
          : apiUrl(
              `${endpoint}?${query[filter]}=${text}&sortby=${query[currentDropdown]}`
            ),
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setData(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (filter === 0 && currentDropdown !== 0 && text !== "") {
      //if only sort is selected and searchbar is not empty
      // Deselected Selected Occupied
      //grab matches from all fields
      if (viewRecords) {
        fetch(apiUrl(`${endpoint}`), {
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
                data.filter(
                  (user) =>
                    user[query[1]].toLowerCase().includes(text.toLowerCase()) ||
                    user[query[2]].toLowerCase().includes(text.toLowerCase()) ||
                    user[query[3]].toLowerCase().includes(text.toLowerCase()) ||
                    user[query[4]].toLowerCase().includes(text.toLowerCase()) ||
                    (user[query[1]] + " " + user[query[2]])
                      .toLowerCase()
                      .includes(text.toLowerCase()) ||
                    (user[query[2]] + " " + user[query[1]])
                      .toLowerCase()
                      .includes(text.toLowerCase())
                ),
                viewRecords ? "_id" : "_id"
              ).sort((a, b) => {
                if (
                  typeof a[query[currentDropdown]] == "string" ||
                  a[query[currentDropdown]] instanceof String
                ) {
                  const nameA = a[query[currentDropdown]].toUpperCase();
                  const nameB = b[query[currentDropdown]].toUpperCase();
                  if (nameA < nameB) {
                    return -1;
                  }
                  if (nameA > nameB) {
                    return 1;
                  }
                  return 0;
                } else if (
                  typeof a[query[currentDropdown]] == "number" ||
                  a[query[currentDropdown]] instanceof Number
                ) {
                  return a[query[currentDropdown]] - b[query[currentDropdown]];
                }
              })
            );
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        fetch(apiUrl(`${endpoint}`), {
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
                data.filter(
                  (user) =>
                    user[sortQuery[1]]
                      .toLowerCase()
                      .includes(text.toLowerCase()) ||
                    user[sortQuery[2]]
                      .toLowerCase()
                      .includes(text.toLowerCase()) ||
                    user[sortQuery[3]]
                      .toLowerCase()
                      .includes(text.toLowerCase()) ||
                    (user[sortQuery[1]] + " " + user[sortQuery[2]])
                      .toLowerCase()
                      .includes(text.toLowerCase()) ||
                    (user[sortQuery[2]] + " " + user[sortQuery[1]])
                      .toLowerCase()
                      .includes(text.toLowerCase())
                ),
                viewRecords ? "_id" : "_id"
              ).sort((a, b) => {
                if (
                  typeof a[sortQuery[currentDropdown]] == "string" ||
                  a[sortQuery[currentDropdown]] instanceof String
                ) {
                  const nameA = a[sortQuery[currentDropdown]].toUpperCase();
                  const nameB = b[sortQuery[currentDropdown]].toUpperCase();
                  if (nameA < nameB) {
                    return -1;
                  }
                  if (nameA > nameB) {
                    return 1;
                  }
                  return 0;
                } else if (
                  typeof a[sortQuery[currentDropdown]] == "number" ||
                  a[sortQuery[currentDropdown]] instanceof Number
                ) {
                  return (
                    a[sortQuery[currentDropdown]] -
                    b[sortQuery[currentDropdown]]
                  );
                }
              })
            );
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else if (
      (filter === 0 && currentDropdown !== 0 && text === "") ||
      (filter !== 0 && currentDropdown !== 0 && text === "")
    ) {
      //if only sort is selected and searchbar is empty
      // Deselected Selected Empty
      // Selected Selected Empty
      fetch(apiUrl(`${endpoint}?sortby=${query[currentDropdown]}`), {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setData(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (
      (filter !== 0 && currentDropdown === 0 && text === "") ||
      (filter === 0 && currentDropdown === 0 && text === "")
    ) {
      //if only sort is selected and searchbar is empty
      // Selected Deselected Empty
      // Deselected Deselected Empty
      fetch(apiUrl(`${endpoint}`), {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setData(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (filter !== 0 && currentDropdown === 0 && text !== "") {
      //sort is deselected while filter is selected
      // Selected Deselected Occupied
      fetch(
        query[filter] === "GWA"
          ? apiUrl(
              `${endpoint}?min=${min}&max=${max}&sortby=${query[currentDropdown]}`
            )
          : apiUrl(
              `${endpoint}?${query[filter]}=${text}
        `
            ),
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setData(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (filter === 0 && currentDropdown === 0 && text !== "") {
      //sort is deselected while filter is also deselected and searchbar is not empty
      // Deselected Deselected Occupied
      //grab matches from all fields
      if (viewRecords) {
        fetch(apiUrl(`${endpoint}`), {
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
                data.filter(
                  (user) =>
                    user[query[1]].toLowerCase().includes(text.toLowerCase()) ||
                    user[query[2]].toLowerCase().includes(text.toLowerCase()) ||
                    user[query[3]].toLowerCase().includes(text.toLowerCase()) ||
                    user[query[4]].toLowerCase().includes(text.toLowerCase()) ||
                    (user[query[1]] + " " + user[query[2]])
                      .toLowerCase()
                      .includes(text.toLowerCase()) ||
                    (user[query[2]] + " " + user[query[1]])
                      .toLowerCase()
                      .includes(text.toLowerCase())
                ),
                viewRecords ? "_id" : "_id"
              )
            );
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        fetch(apiUrl(`${endpoint}`), {
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
                data.filter(
                  (user) =>
                    user[sortQuery[1]]
                      .toLowerCase()
                      .includes(text.toLowerCase()) ||
                    user[sortQuery[2]]
                      .toLowerCase()
                      .includes(text.toLowerCase()) ||
                    user[sortQuery[3]]
                      .toLowerCase()
                      .includes(text.toLowerCase()) ||
                    (user[sortQuery[1]] + " " + user[sortQuery[2]])
                      .toLowerCase()
                      .includes(text.toLowerCase()) ||
                    (user[sortQuery[2]] + " " + user[sortQuery[1]])
                      .toLowerCase()
                      .includes(text.toLowerCase())
                ),
                viewRecords ? "_id" : "_id"
              )
            );
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  //grab all matches from all fields
  const fetchSearchData = () => {
    if (text !== "" || max !== "" || min !== "") {
      if (filter !== 0 && sort === 0) {
        // If only filter is selected
        // Selected Deselected Occupied
        fetch(
          apiUrl(
            choices[filter] === "GWA"
              ? `${endpoint}?min=${min === "" ? 1 : min}&max=${
                  max === "" ? 5 : max
                }`
              : `${endpoint}?${query[filter]}=${text}`
          ),
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            setData(data);
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (filter === 0 && sort !== 0) {
        // If only sort is selected
        // Deselected Selected Occupied
        // Grab all matches
        if (viewRecords) {
          fetch(apiUrl(`${endpoint}`), {
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
                  data.filter(
                    (user) =>
                      user[query[1]]
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      user[query[2]]
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      user[query[3]]
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      user[query[4]]
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      (user[query[1]] + " " + user[query[2]])
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      (user[query[2]] + " " + user[query[1]])
                        .toLowerCase()
                        .includes(text.toLowerCase())
                  ),
                  viewRecords ? "_id" : "_id"
                ).sort((a, b) => {
                  if (
                    typeof a[query[sort]] == "string" ||
                    a[query[sort]] instanceof String
                  ) {
                    const nameA = a[query[sort]].toUpperCase();
                    const nameB = b[query[sort]].toUpperCase();
                    if (nameA < nameB) {
                      return -1;
                    }
                    if (nameA > nameB) {
                      return 1;
                    }
                    return 0;
                  } else if (
                    typeof a[query[sort]] == "number" ||
                    a[query[sort]] instanceof Number
                  ) {
                    return a[query[sort]] - b[query[sort]];
                  }
                })
              );
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          fetch(apiUrl(`${endpoint}`), {
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
                  data.filter(
                    (user) =>
                      user[sortQuery[1]]
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      user[sortQuery[2]]
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      user[sortQuery[3]]
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      (user[sortQuery[1]] + " " + user[sortQuery[2]])
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      (user[sortQuery[2]] + " " + user[sortQuery[1]])
                        .toLowerCase()
                        .includes(text.toLowerCase())
                  ),
                  viewRecords ? "_id" : "_id"
                ).sort((a, b) => {
                  if (
                    typeof a[sortQuery[sort]] == "string" ||
                    a[sortQuery[sort]] instanceof String
                  ) {
                    const nameA = a[sortQuery[sort]].toUpperCase();
                    const nameB = b[sortQuery[sort]].toUpperCase();
                    if (nameA < nameB) {
                      return -1;
                    }
                    if (nameA > nameB) {
                      return 1;
                    }
                    return 0;
                  } else if (
                    typeof a[sortQuery[sort]] == "number" ||
                    a[sortQuery[sort]] instanceof Number
                  ) {
                    return a[sortQuery[sort]] - b[sortQuery[sort]];
                  }
                })
              );
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } else if (filter !== 0 && sort !== 0) {
        // If both sort and filter are selected
        // Selected Selected Occupied
        // Grab all matches
        fetch(
          apiUrl(
            choices[filter] === "GWA"
              ? `${endpoint}?min=${min}&max=${max}&sortby=${query[sort]}`
              : `${endpoint}?${query[filter]}=${text}&&sortby=${query[sort]}`
          ),
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            setData(data);
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (filter === 0 && sort === 0) {
        // Both filter and sort deselected
        // Deselected Deselected Occupied
        // Grab all matches
        if (viewRecords) {
          fetch(apiUrl(`${endpoint}`), {
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
                  data.filter(
                    (user) =>
                      user[query[1]]
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      user[query[2]]
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      user[query[3]]
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      user[query[4]]
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      (user[query[1]] + " " + user[query[2]])
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      (user[query[2]] + " " + user[query[1]])
                        .toLowerCase()
                        .includes(text.toLowerCase())
                  ),
                  viewRecords ? "_id" : "_id"
                )
              );
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          fetch(apiUrl(`${endpoint}`), {
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
                  data.filter(
                    (user) =>
                      user[sortQuery[1]]
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      user[sortQuery[2]]
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      user[sortQuery[3]]
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      (user[sortQuery[1]] + " " + user[sortQuery[2]])
                        .toLowerCase()
                        .includes(text.toLowerCase()) ||
                      (user[sortQuery[2]] + " " + user[sortQuery[1]])
                        .toLowerCase()
                        .includes(text.toLowerCase())
                  ),
                  viewRecords ? "_id" : "_id"
                )
              );
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    } else {
      if ((filter === 0 && sort === 0) || (filter !== 0 && sort === 0)) {
        // Get all no query
        // Selected Deselected Empty
        // Deselected Deselected Empty
        fetch(apiUrl(`${endpoint}`), {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setData(data);
          })
          .catch((err) => {
            console.log(err);
          });
      } else if ((filter === 0 && sort !== 0) || (filter !== 0 && sort !== 0)) {
        // Get all and sort
        // Deselected Selected Empty
        // Selected Selected Empty
        fetch(apiUrl(`${endpoint}?sortby=${query[sort]}`), {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setData(data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  return (
    <div className={`container ${styles.container} ` + styles.noPrint}>
      <div className={"row " + styles.noPrint}>
        {/*Change searchbar if GWA filter is selected*/}
        {choices[filter] !== "GWA" ? (
          <div className="px-0 col-lg-4 col-md-6 col-sm-5 col-12">
            <div className="input-group">
              <input
                type="search"
                placeholder="Search"
                className={`form-control border-end-0 rounded-pill rounded-end `}
                id="search"
                value={text}
                disabled={
                  searchParams.get("upload_id") || searchParams.get("email")
                    ? true
                    : false
                }
                onChange={async (e) =>
                  await setText(toTitleCase(e.target.value))
                }
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    fetchSearchData();
                  }
                }}
              ></input>
              <span
                className={`input-group-text bg-white p-0 rounded-start border-start-0 rounded-pill rounded"
                }`}
              >
                <div
                  className={
                    "btn py-1 px-2 rounded-pill " +
                    (searchParams.get("upload_id") || searchParams.get("email")
                      ? " disabled "
                      : " ")
                  }
                >
                  <i
                    className="bi bi-search rounded-pill"
                    onClick={() => {
                      if (
                        !searchParams.get("upload_id") ||
                        searchParams.get("email")
                      )
                        fetchSearchData();
                    }}
                  ></i>
                </div>
              </span>
            </div>
          </div>
        ) : (
          <div className="col-lg-6 col-md-12 col-12">
            <div className="row">
              <div className="col-lg-5 col-md-5 col-5 px-1">
                <div className={`input-group`}>
                  <input
                    className={`form-control rounded-pill`}
                    placeholder="Min"
                    name="srch-term"
                    id="ed-srch-term"
                    type="text"
                    value={min}
                    onChange={async (e) => {
                      await setMin(e.target.value);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        fetchSearchData();
                      }
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-5 col-md-5 col-5 px-1">
                <div className={`input-group`}>
                  <input
                    className={`form-control rounded-pill`}
                    placeholder="Max"
                    name="srch-term"
                    id="ed-srch-term"
                    type="text"
                    value={max}
                    onChange={async (e) => {
                      await setMax(e.target.value);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        fetchSearchData();
                      }
                    }}
                  />
                </div>
              </div>
              <div className={"px-0 col-lg-2 col-md-1 col-1 d-flex"}>
                <span
                  className={`input-group-text bg-white p-0 rounded-pill rounded"
                }`}
                >
                  <div className="btn py-1 px-2 rounded-pill ">
                    <i
                      className="bi bi-search rounded-pill"
                      onClick={() => {
                        fetchSearchData();
                      }}
                    ></i>
                  </div>
                </span>
              </div>
            </div>
          </div>
        )}
        {/*Filter dropdown button*/}
        <div className="h-50 col-lg-2 col-md-3 col-sm-3 col-6">
          <div className="dropdown">
            <button
              className={
                "btn rounded-pill dropdown-toggle " + styles.taskbarBtn
              }
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {filter == 0 ? "Filter by" : choices[filter]}
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              {choices.map((choice, i) => (
                <li
                  key={i}
                  onClick={async () => {
                    {
                      /*Disable choices if viewUploaded students*/
                    }
                    if (
                      !searchParams.get("upload_id") ||
                      !searchParams.get("email") ||
                      choices.indexOf(choice) === 0
                    ) {
                      searchParams.delete("upload_id");
                      searchParams.delete("email");
                      setSearchParams(searchParams);
                      setMin("");
                      setMax("");
                      setFilter(choices.indexOf(choice));
                      fetchFilterData(choices.indexOf(choice));
                    }
                  }}
                >
                  <a
                    className={
                      ((searchParams.get("upload_id") ||
                        searchParams.get("email")) &&
                      choices.indexOf(choice) > 0
                        ? " disabled "
                        : " ") + " dropdown-item "
                    }
                    href="#"
                  >
                    {choice}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/*Sort dropdown button*/}
        <div className="h-50 col-lg-2 col-md-2 col-sm-3 col-4">
          <div className="dropdown">
            <button
              className={
                "btn rounded-pill dropdown-toggle " + styles.taskbarBtn
              }
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {sort == 0 ? "Sort by" : choices[sort]}
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              {choices.map((choice, i) => (
                <li
                  key={i}
                  onClick={async () => {
                    setSort(choices.indexOf(choice));
                    fetchSortData(choices.indexOf(choice));
                  }}
                >
                  <a className="dropdown-item" href="#">
                    {choice}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/*Pagination*/}
        <div className="h-50 col-lg-2 col-md-3 col-sm-3 d-flex justify-content-center my-1 col-4">
          <nav aria-label="h-50 Page navigation example">
            <ul className={` pagination mt-1 mb-2`}>
              <li
                className={`${
                  pages[0] === currentPage ? `page-item disabled` : `page-item`
                }`}
              >
                <p
                  className={`page-link ${styles.pageLink}`}
                  onClick={() => setCurrentPage(pages[0])}
                >
                  &laquo;
                </p>
              </li>
              {getViewablePages().map((page, index) => (
                <li
                  key={index}
                  className={`${
                    page === currentPage ? `page-item active ` : `page-item`
                  }`}
                >
                  <p
                    className={`${
                      page === currentPage
                        ? `page-link ${styles.pageLink} ${styles.active}`
                        : `page-link ${styles.pageLink}`
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </p>
                </li>
              ))}
              <li
                className={`${
                  pages[pages.length - 1] === currentPage
                    ? `page-item disabled `
                    : `page-item `
                }`}
              >
                <p
                  className={`page-link ${styles.pageLink}`}
                  onClick={() => setCurrentPage(pages.length)}
                >
                  &raquo;
                </p>
              </li>
            </ul>
          </nav>
        </div>
        {/*Print button*/}
        <div className={"col-lg-1 col-md-2 col-sm-2 my-1 col-3"}>
          <button
            className={styles.printBtn + " " + styles.noPrint}
            type="button col-2"
            onClick={async () => {
              if (viewRecords === true) {
                document.getElementsByClassName(
                  "topmostCheckbox"
                )[0].checked = false;
              }

              data.map((user) => (user.checked = false));
              await setToPrint(true);
              window.print();
              await setToPrint(false);
            }}
          >
            PRINT
          </button>
        </div>
        {/*Check if viewRecords page*/}
        {/*Delete button*/}
        {viewRecords == true ? (
          <div className="col-lg-1 col-md-2 col-sm-2 col-3">
            <button
              className="btn bi bi-trash text-danger rounded-pill"
              onClick={() => deleteData()}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
