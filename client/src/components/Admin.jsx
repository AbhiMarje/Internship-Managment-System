import React, { useState, useEffect, useContext } from "react";
import banner from "./gitbanner.png";
import MaterialTable from "@material-table/core";
import { ExportPdf, ExportCsv } from "@material-table/exporters";
import download from "downloadjs";
import Loading from "./Loading";
import userContext from "./UserContext";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx/xlsx.mjs";

function Admin() {
  const { user } = useContext(userContext);
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
  const [isLoading, setIsLoading] = useState(false);
  const [loadFilter, setLoadFilter] = useState("UploadData");
  const [studentFile, setStudentFile] = useState();
  const [loadBatch, setLoadBatch] = useState();
  const [studentData, setStudentData] = useState([]);
  const [studentjsonData, setStudentJsonData] = useState([]);
  const [studentDeleteFilter, setStudentDeleteFilter] = useState("USN");
  const [studentDeleteUsn, setStudentDeleteUsn] = useState("");
  const [studentDeleteBatch, setStudentDeleteBatch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }

    getBatches();
    getMentors();
  }, [user, navigate]);

  const convertToJSON = (header, data) => {
    const jsonData = [];
    header.forEach((head, index) => {
      header[index] = head.trim();
    });
    data.forEach((row) => {
      row.push(loadBatch);
    });
    data.forEach((row) => {
      let rowData = {};
      row.forEach((element, i) => {
        if (i === 2) {
          rowData["Batch"] = element.trim();
        } else if (i === 1) {
          rowData[header[i]] = element.toUpperCase().trim();
        } else {
          rowData[header[i]] = element.trim();
        }
      });
      jsonData.push(rowData);
    });
    setStudentJsonData(jsonData);
  };

  const ImportExcel = (e) => {
    const file = studentFile;
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, {
        type: "binary",
      });
      const first_sheet_name = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[first_sheet_name];
      const fileData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const headers = fileData[0];
      fileData.splice(0, 1);
      convertToJSON(headers, fileData);
      setStudentData(studentjsonData);
    };

    reader.readAsBinaryString(file);
  };

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
    } else if (filter === "Companies") {
      fetchAllCompanyList();
    }

    setusn("");
  };

  const HandleSubmit = (e) => {
    e.preventDefault();

    if (loadFilter === "UploadData") {
      if (studentFile && loadBatch) {
        ImportExcel();
      } else {
        window.alert("Please fill all the fields");
      }
    } else if (loadFilter === "NoInternship") {
      if (loadBatch) {
        getStudentsWithNoInternship();
      } else {
        window.alert("Please select a batch");
      }
    }
  };

  const HandleStudentDelete = (e) => {
    e.preventDefault();

    if (studentDeleteFilter === "USN") {
      DeleteStudentByUSN(studentDeleteUsn);
    } else if (studentDeleteFilter === "Batch") {
      DeleteStudentByBatch(studentDeleteBatch);
    }
  };

  const HandleDelete = (e) => {
    e.preventDefault();

    if (deleteFilter === "USN") {
      DeleteUserByUSN(deleteUsn);
    } else if (deleteFilter === "Batch") {
      DeleteUserByBatch(deleteBatch);
    } else if (deleteFilter === "Mentor") {
      DeleteUserByMentor(deleteMentor);
    }

    setDeleteFilter("USN");
  };

  const getStudentsWithNoInternship = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/getStudentsWithNoInternship",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ loadBatch }),
        }
      );

      const data = await response.json();
      setIsLoading(false);

      if (data.message) {
        setStudentData(data.message);
      } else if (data.error) {
        window.alert(data.error);
      } else {
        window.alert("Something went wrong please try again");
      }
    } catch (error) {
      window.alert(error.message);
      setIsLoading(false);
    }
  };

  const UploadStudentData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/uploadStudentData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ studentjsonData }),
        }
      );

      const data = await response.json();
      setIsLoading(false);

      if (data.message) {
        window.alert(data.message);
      } else if (data.error) {
        window.alert(data.error);
      } else {
        window.alert("Something went wrong please try again");
      }
    } catch (error) {
      window.alert(error.message);
      setIsLoading(false);
    }
  };

  const DeleteUserByUSN = async (deleteUsn) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/deleteUserByUSN",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deleteUsn,
          }),
        }
      );
      const data = await response.json();
      setIsLoading(false);
      setDeleteUsn("");

      if (!data.message) {
        window.alert("Something went wrong please try again");
      } else {
        window.alert(data.message);
      }
    } catch (error) {
      window.alert(error.message);
      setDeleteUsn("");
      setIsLoading(false);
    }
  };

  const DeleteStudentByUSN = async (studentDeleteUsn) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/deleteStudentByUSN",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentDeleteUsn,
          }),
        }
      );

      const data = await response.json();
      setIsLoading(false);
      setStudentDeleteUsn("");

      if (!data.message) {
        window.alert("Something went wrong please try again");
      } else {
        window.alert(data.message);
      }
    } catch (error) {
      window.alert(error.message);
      setStudentDeleteUsn("");
      setIsLoading(false);
    }
  };

  const DeleteStudentByBatch = async (studentDeleteBatch) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/deleteStudentByBatch",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentDeleteBatch,
          }),
        }
      );

      const data = await response.json();
      setIsLoading(false);

      if (!data.message) {
        window.alert("Something went wrong please try again");
      } else {
        window.alert(data.message);
      }
    } catch (error) {
      window.alert(error.message);
      setIsLoading(false);
    }
  };

  const DeleteUserByBatch = async (deleteBatch) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/deleteUsersByBatch",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deleteBatch,
          }),
        }
      );
      const data = await response.json();
      setIsLoading(false);

      if (!data.message) {
        window.alert("Something went wrong please try again");
      } else {
        window.alert(data.message);
      }
    } catch (error) {
      window.alert(error.message);
      setIsLoading(false);
    }
  };

  const DeleteUserByMentor = async (deleteMentor) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/deleteUsersByMentor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deleteMentor,
          }),
        }
      );
      const data = await response.json();
      setIsLoading(false);

      if (!data.message) {
        window.alert("Something went wrong please try again");
      } else {
        window.alert(data.message);
      }
    } catch (error) {
      window.alert(error.message);
      setIsLoading(false);
    }
  };

  const DeleteMentor = async () => {
    try {
      const mMentor = window.prompt("Select Mentor to delete");
      const mentor = mMentor.trim();
      setIsLoading(true);
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
      setIsLoading(false);
      if (!result.message) {
        window.alert("Something went wrong please try again");
      } else {
        window.alert(result.message);
        getMentors();
      }
    } catch (error) {
      window.alert(error.message);
      setIsLoading(false);
    }
  };

  const DeleteBatch = async () => {
    try {
      const mBatch = window.prompt("Select Batch to delete");
      const batch = mBatch.trim();
      setIsLoading(true);
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
      setIsLoading(false);
      if (!result.message) {
        window.alert("Something went wrong please try again");
      } else {
        window.alert(result.message);
        getBatches();
      }
    } catch (error) {
      window.alert(error.message);
      setIsLoading(false);
    }
  };

  const getBatches = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/getBatches", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      setIsLoading(false);
      if (!result.message || result.error) {
        window.alert("Something went wrong please try again");
      } else {
        setBatches(result.message);
      }
    } catch (error) {
      window.alert(error.message);
      setIsLoading(false);
    }
  };

  const getMentors = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/getMentors", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      setIsLoading(false);
      if (!result.message || result.error) {
        window.alert("Something went wrong please try again");
      } else {
        setMentors(result.message);
      }
    } catch (error) {
      window.alert(error.message);
      setIsLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:5000/api/getAllData", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();
      setIsLoading(false);

      if (result.error) {
        window.alert(result.error);
      } else {
        setData(result.message);
      }
    } catch (error) {
      window.alert(error.message);
      setIsLoading(false);
    }
  };

  const fetchDataByUSN = async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);

      if (result.error) {
        window.alert(result.error);
      } else {
        setData(result.message);
      }
    } catch (err) {
      window.alert(err.message);
      setIsLoading(false);
    }
  };

  const fetchAllCompanyList = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:5000/api/getAllCompanyList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          batch,
        }),
      });

      const result = await res.json();
      setIsLoading(false);

      let companies = new Set();
      if (result.error) {
        window.alert(result.error);
      } else {
        const list = result.message;
        list.forEach((data) => {
          companies.add(data.nameOfIndustry.toUpperCase());
        });
      }
      let allCompanies = [];
      companies.forEach((ele) => {
        allCompanies.push({ company: ele });
      });
      setData(allCompanies);
    } catch (error) {
      window.alert(error.message);
      setIsLoading(false);
    }
  };

  const fetchDataByBatch = async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);

      if (result.error) {
        window.alert(result.error);
      } else {
        setData(result.message);
      }
    } catch (err) {
      window.alert(err.message);
      setIsLoading(false);
    }
  };

  const fetchDataByMentor = async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);

      if (result.error) {
        window.alert(result.error);
      } else {
        setData(result.message);
      }
    } catch (err) {
      window.alert(err.message);
      setIsLoading(false);
    }
  };

  const AddNewBatch = async (e) => {
    const mBatch = window.prompt("Enter the new batch number");
    const batch = mBatch.trim();

    if (batch) {
      try {
        setIsLoading(true);
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
        setIsLoading(false);

        if (!result) {
          window.alert("Something went wrong please try again");
        } else {
          window.alert(result.message);
        }

        getBatches();
      } catch (err) {
        window.alert(err.message);
        setIsLoading(false);
      }
    }
  };

  const AddNewMentor = async (e) => {
    const mMentor = window.prompt("Enter the new mentor name");
    const mentor = mMentor.trim();
    if (mentor) {
      try {
        setIsLoading(true);
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
        setIsLoading(false);

        if (!result) {
          window.alert("Something went wrong please try again");
        } else {
          window.alert(result.message);
        }

        getMentors();
      } catch (err) {
        window.alert(err.message);
        setIsLoading(false);
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
      setIsLoading(false);
    }
  };

  const columns2 = [{ title: "Companies", field: "company" }];

  const studentColumn = [
    { title: "Name", field: "Name" },
    { title: "USN", field: "USN" },
    { title: "Batch", field: "Batch" },
  ];

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
    { title: "Months", field: "noOfMonths" },
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
      {isLoading ? <Loading /> : ""}
      <nav>
        <img src={banner} alt="Banner" className="git-banner" />
        <h1>KLS Gogte Institute of Technology</h1>
      </nav>
      <div>
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
                  <option value="Companies">Company list</option>
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
              {filter === "Companies" ? (
                <label className="column">
                  Batch:
                  <select
                    className="input-col"
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
                        marginTop: "8%",
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
              columns={filter === "Companies" ? columns2 : columns}
              options={{
                search: true,
                exportFileName: "Internship-Data",
                paging: true,
                filtering: true,
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
                  backgroundColor: "#3d3d3d",
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
        <div className="main-container">
          <div className="filter-container">
            <form onSubmit={HandleSubmit}>
              <label className="column">
                Load Data:
                <select
                  className="input-col"
                  value={loadFilter}
                  onChange={(e) => setLoadFilter(e.target.value)}
                >
                  <option value="UploadData">Upload Student Data</option>
                  <option value="NoInternship">
                    Students with 0 submissions
                  </option>
                </select>
              </label>
              {loadFilter === "UploadData" ? (
                <div>
                  <label className="column">
                    Select Batch:
                    <select
                      className="input-col"
                      value={loadBatch}
                      onChange={(e) => setLoadBatch(e.target.value)}
                    >
                      <option>Select a Batch</option>
                      {batches.map((batch, i) => (
                        <option key={i} value={batch.batch}>
                          {batch.batch}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="column">
                    Upload File:
                    <input
                      className="input-col"
                      type="file"
                      onChange={(e) => setStudentFile(e.target.files[0])}
                    />
                  </label>
                </div>
              ) : (
                ""
              )}
              {loadFilter === "NoInternship" ? (
                <label className="column">
                  Select Batch:
                  <select
                    className="input-col"
                    value={loadBatch}
                    onChange={(e) => setLoadBatch(e.target.value)}
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
              <input className="login-button" type="submit" value="Submit" />
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
                        marginTop: "8%",
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
              data={studentData}
              columns={studentColumn}
              options={{
                search: true,
                exportFileName: "Internship-Data",
                paging: true,
                filtering: true,
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
                  backgroundColor: "#3d3d3d",
                  color: "White",
                  whiteSpace: "nowrap",
                },
              }}
            />
            {loadFilter === "UploadData" ? (
              <button className="login-button" onClick={UploadStudentData}>
                Submit
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="main-container">
          <div className="filter-container">
            <form onSubmit={HandleStudentDelete}>
              <label className="column">
                Delete By:
                <select
                  className="input-col"
                  value={studentDeleteFilter}
                  onChange={(e) => setStudentDeleteFilter(e.target.value)}
                >
                  <option value="USN">USN</option>
                  <option value="Batch">Batch</option>
                </select>
              </label>
              {studentDeleteFilter === "Batch" ? (
                <label className="column">
                  Batch:
                  <select
                    className="input-col"
                    value={studentDeleteBatch}
                    onChange={(e) => setStudentDeleteBatch(e.target.value)}
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
              {studentDeleteFilter === "USN" ? (
                <label className="column">
                  USN:
                  <input
                    className="input-col"
                    type="text"
                    value={studentDeleteUsn}
                    placeholder="USN"
                    onChange={(e) => setStudentDeleteUsn(e.target.value)}
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
    </div>
  );
}

export default Admin;
