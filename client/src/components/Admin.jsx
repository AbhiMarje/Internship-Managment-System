import React, { useState, useEffect } from "react";
import banner from "./gitbanner.png";
import MaterialTable from "@material-table/core";
import { ExportPdf, ExportCsv } from "@material-table/exporters";
import download from "downloadjs";

function Admin() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("USN");
  const [deleteFilter, setDeleteFilter] = useState("USN");
  const [mentor, setMentor] = useState("");
  const [deleteMentor, setDeleteMentor] = useState("");
  const [usn, setusn] = useState("");
  const [deleteUsn, setDeleteUsn] = useState("");
  const [batch, setBatch] = useState("");
  const [deleteBatch, setDeleteBatch] = useState("");
  const [batches, setBatches] = useState([]);
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    getBatches();
    getMentors();
  }, []);

  const HandleFilter = (e) => {
    e.preventDefault();

    if (filter === "USN") {
      if (usn) {
        fetchDataByUSN();
      } else {
        window.alert("Please enter USN");
      }
    } else if (filter === "Batch") {
      fetchDataByBatch();
    } else if (filter === "Mentor") {
      fetchDataByMentor();
    } else if (filter === "All") {
      fetchAllData();
    }

    setFilter("USN");
    setusn("");
  };

  const HandleDelete = (e) => {
    e.preventDefault();

    if (deleteFilter === "USN") {
      console.log(deleteUsn);
    } else if (deleteFilter === "Batch") {
      console.log(deleteBatch);
    } else if (deleteFilter === "Mentor") {
      console.log(deleteMentor);
    }

    setDeleteFilter("USN");
    setDeleteUsn("");
  };

  const DeleteMentor = async () => {
    const mMentor = window.prompt("Select Mentor to delete");
    const mentor = mMentor.trim();
    const response = await fetch("http://localhost:5000/api/deleteMentor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mentor,
      }),
    });
    const result = await response.json();
    if (!result.message) {
      window.alert("Something went wrong please try again");
    } else {
      window.alert("Mentor Deleted Successfully");
      getMentors();
    }
  };

  const DeleteBatch = async () => {
    const mBatch = window.prompt("Select Batch to delete");
    const batch = mBatch.trim();
    const response = await fetch("http://localhost:5000/api/deleteBatch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        batch,
      }),
    });
    const result = await response.json();
    if (!result.message) {
      window.alert("Something went wrong please try again");
    } else {
      window.alert("Batch Deleted Successfully");
      getBatches();
    }
  };

  const getBatches = async () => {
    const response = await fetch("http://localhost:5000/api/getBatches", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    if (!result) {
      window.alert("Something went wrong please try again");
    } else {
      setBatches(result.message);
    }
  };

  const getMentors = async () => {
    const response = await fetch("http://localhost:5000/api/getMentors", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    if (!result) {
      window.alert("Something went wrong please try again");
    } else {
      setMentors(result.message);
    }
  };

  const fetchAllData = async () => {
    const res = await fetch("http://localhost:5000/api/getAllData", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (result.error) {
      window.alert(result.error);
    } else {
      setData(result.message);
    }
  };

  const fetchDataByUSN = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/getDataByUSN", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usn,
        }),
      });
      const result = await res.json();

      if (result.error) {
        window.alert(result.error);
      } else {
        setData(result.message);
      }
    } catch (err) {
      window.alert(err.message);
    }
  };

  const fetchDataByBatch = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/getDataByBatch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          batch,
        }),
      });
      const result = await res.json();

      if (result.error) {
        window.alert(result.error);
      } else {
        setData(result.message);
      }
    } catch (err) {
      window.alert(err.message);
    }
  };

  const fetchDataByMentor = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/getDataByMentor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mentor,
        }),
      });
      const result = await res.json();

      if (result.error) {
        window.alert(result.error);
      } else {
        setData(result.message);
      }
    } catch (err) {
      window.alert(err.message);
    }
  };

  const AddNewBatch = async (e) => {
    const mBatch = window.prompt("Enter the new batch number");
    const batch = mBatch.trim();
    if (batch) {
      try {
        const res = await fetch("http://localhost:5000/api/addNewBatch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            batch,
          }),
        });

        const result = await res.json();

        if (!result) {
          window.alert("Something went wrong please try again");
        } else {
          window.alert(result.message);
        }

        getBatches();
      } catch (err) {
        window.alert(err.message);
      }
    }
  };

  const AddNewMentor = async (e) => {
    const mMentor = window.prompt("Enter the new mentor name");
    const mentor = mMentor.trim();
    if (mentor) {
      try {
        const res = await fetch("http://localhost:5000/api/addNewMentor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mentor,
          }),
        });

        const result = await res.json();

        if (!result) {
          window.alert("Something went wrong please try again");
        } else {
          window.alert(result.message);
        }

        getMentors();
      } catch (err) {
        window.alert(err.message);
      }
    }
  };

  const DownloadFile = async (data) => {
    for (var i = 0; i < 4; i++) {
      if (i === 0) {
        const filename = data.insCert;
        Download(filename);
      } else if (i === 1) {
        const filename = data.insRep;
        Download(filename);
      } else if (i === 2) {
        const filename = data.insExtEval;
        Download(filename);
      } else if (i === 3) {
        const filename = data.insExtFed;
        Download(filename);
      }
    }
  };

  const Download = async (filename) => {
    try {
      const res = await fetch("http://localhost:5000/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename,
        }),
      });

      const blob = await res.blob();
      if (!blob) {
        window.alert("Something went wrong please try again");
      } else {
        download(blob, filename);
      }
    } catch (err) {
      window.alert(err.message);
    }
  };

  const columns = [
    { title: "Name", field: "name", width: "80%" },
    { title: "USN", field: "USN" },
    { title: "Batch", field: "batch" },
    { title: "No. of Internship", field: "noOfInternship" },
    { title: "Name of Industry", field: "nameOfIndustry" },
    { title: "Address of Industry", field: "AddressOfIndustry" },
    { title: "Internship Domain", field: "internshipDomain" },
    { title: "Start Date", field: "startDate" },
    { title: "End Date", field: "endDate" },
    { title: "Weeks of Internship", field: "weeksOfInternship" },
    { title: "Industry Guide Name", field: "industryGuide" },
    { title: "Industry Guide Email", field: "emailOfIndustryGuide" },
    { title: "Industry Guide No.", field: "noOfIndustryGuide" },
    { title: "Stipend Received", field: "stipendReceived" },
    { title: "Amount of Stipend", field: "amountOfStipend" },
    { title: "To be Evaluated", field: "toBeEval" },
    { title: "Mode of Internship", field: "modeOfInternship" },
    { title: "Mentor Name", field: "mentorName" },
    { title: "Internship Certificate", field: "insCert" },
    { title: "Internship Report", field: "insRep" },
    { title: "Internship External Evaluation", field: "insExtEval" },
    { title: "Internship External Feedback", field: "insExtFed" },
  ];

  return (
    <div>
      <nav>
        <img src={banner} alt="Banner" className="git-banner" />
        <h1>KLS Gogte Institute of Technology</h1>
      </nav>
      <div className="admin-buttons-container">
        <button className="batch-button" onClick={AddNewBatch}>
          Add New Batch
        </button>
        <button className="mentor-button" onClick={AddNewMentor}>
          Add New Mentor
        </button>
        <button className="batch-button" onClick={DeleteBatch}>
          Delete Batch
        </button>
        <button className="mentor-button" onClick={DeleteMentor}>
          Delete Mentor
        </button>
      </div>
      <div className="table-container">
        <div className="filter-container">
          <form onSubmit={HandleFilter}>
            <label className="column">
              Fliter By:
              <select
                className="input-col"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="USN">USN</option>
                <option value="Mentor">Mentor</option>
                <option value="Batch">Batch</option>
                <option value="All">Show All</option>
              </select>
            </label>
            {filter === "Mentor" ? (
              <label className="column">
                Mentor:
                <select
                  className="input-col"
                  value={mentor}
                  onChange={(e) => setMentor(e.target.value)}
                >
                  <option>Select a Mentor</option>
                  {mentors.map((mentor, i) => (
                    <option key={i} value={mentor.mentor} selected="true">
                      {mentor.mentor}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              ""
            )}
            {filter === "Batch" ? (
              <label className="column">
                Batch:
                <select
                  className="input-col"
                  defaultValue={batches[0].batch}
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                >
                  <option>Select a Batch</option>
                  {batches.map((batch, i) => (
                    <option key={i} value={batch.batch}>
                      {batch.batch}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              ""
            )}
            {filter === "USN" ? (
              <label className="column">
                USN:
                <input
                  className="input-col"
                  type="text"
                  value={usn}
                  placeholder="USN"
                  onChange={(e) => setusn(e.target.value)}
                />
              </label>
            ) : (
              ""
            )}
            <input className="login-button" type="submit" value="Filter" />
          </form>
        </div>
      </div>
      <div className="main-container">
        <div className="filter-container">
          <MaterialTable
            localization={{
              body: {
                emptyDataSourceMessage: (
                  <h2
                    style={{
                      marginTop: "6%",
                      position: "absolute",
                      top: "16%",
                      marginLeft: "40%",
                      marginRight: "40%",
                      textAlign: "center",
                    }}
                  >
                    No records to display
                  </h2>
                ),
              },
            }}
            title="Internship Data"
            data={data}
            columns={columns}
            options={{
              search: true,
              exportFileName: "Internship-Data",
              paging: true,
              actionsColumnIndex: -1,
              exportMenu: [
                {
                  label: "Export PDF",
                  exportFunc: (columns, data) =>
                    ExportPdf(columns, data, "Internship-Data"),
                },
                {
                  label: "Export CSV",
                  exportFunc: (columns, data) =>
                    ExportCsv(columns, data, "Internship-Data"),
                },
              ],
              headerStyle: {
                backgroundColor: "#383838",
                color: "White",
                whiteSpace: "nowrap",
              },
            }}
            actions={[
              {
                icon: "download",
                tooltip: "Download",
                onClick: (event, rowData) => {
                  DownloadFile(rowData);
                },
              },
            ]}
          />
        </div>
      </div>
      <div className="main-container">
        <div className="filter-container">
          <form onSubmit={HandleDelete}>
            <label className="column">
              Delete By:
              <select
                className="input-col"
                value={deleteFilter}
                onChange={(e) => setDeleteFilter(e.target.value)}
              >
                <option value="USN">USN</option>
                <option value="Mentor">Mentor</option>
                <option value="Batch">Batch</option>
              </select>
            </label>
            {deleteFilter === "Mentor" ? (
              <label className="column">
                Mentor:
                <select
                  className="input-col"
                  value={deleteMentor}
                  onChange={(e) => setDeleteMentor(e.target.value)}
                >
                  <option>Select a Mentor</option>
                  {mentors.map((mentor, i) => (
                    <option key={i} value={mentor.mentor} selected="true">
                      {mentor.mentor}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              ""
            )}
            {deleteFilter === "Batch" ? (
              <label className="column">
                Batch:
                <select
                  className="input-col"
                  defaultValue={batches[0].batch}
                  value={deleteBatch}
                  onChange={(e) => setDeleteBatch(e.target.value)}
                >
                  <option>Select a Batch</option>
                  {batches.map((batch, i) => (
                    <option key={i} value={batch.batch}>
                      {batch.batch}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              ""
            )}
            {deleteFilter === "USN" ? (
              <label className="column">
                USN:
                <input
                  className="input-col"
                  type="text"
                  value={deleteUsn}
                  placeholder="USN"
                  onChange={(e) => setDeleteUsn(e.target.value)}
                />
              </label>
            ) : (
              ""
            )}
            <input className="login-button" type="submit" value="Delete" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Admin;
