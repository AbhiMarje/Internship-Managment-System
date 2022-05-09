import React, { useState, useEffect } from "react";
import banner from "./gitbanner.png";
import Loading from "./Loading";

function Home() {
  const [name, setName] = useState("");
  const [usn, setusn] = useState("");
  const [batch, setBatch] = useState("");
  const [noOfInternship, setNoOfInternship] = useState("1st Internship");
  const [nameOfIndustry, setNameOfIndustry] = useState("");
  const [AddressOfIndustry, setAddressOfIndustry] = useState("");
  const [internshipDomain, setInternshipDomain] = useState("App Development");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [weeksOfInternship, setWeeksOfInternship] = useState(0);
  const [industryGuide, setIndustryGuide] = useState("");
  const [emailOfIndustryGuide, setEmailOfIndustryGuide] = useState("");
  const [noOfIndustryGuide, setNoOfIndustryGuide] = useState("");
  const [stipendReceived, setStipendReceived] = useState("Yes");
  const [amountOfStipend, setAmountOfStipend] = useState("");
  const [toBeEval, setToBeEval] = useState("Yes");
  const [modeOfInternship, setModeOfInternship] = useState("Online");
  const [mentorName, setMentorName] = useState("");
  const [internshipCert, setInternshipCert] = useState();
  const [internshipReport, setInternshipReport] = useState();
  const [internshipExtEval, setInternshipExtEval] = useState();
  const [intenshipExtFed, setIntenshipExtFed] = useState();
  const [batches, setBatches] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getBatches();
    getMentors();
  }, []);

  const HandleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        !internshipCert ||
        !internshipReport ||
        !internshipExtEval ||
        !intenshipExtFed
      ) {
        window.alert("Please fill all the fields");
      } else {
        const USN = usn.toUpperCase();
        const insCert = USN + "_" + internshipCert.name;
        const insRep = USN + "_" + internshipReport.name;
        const insExtEval = USN + "_" + internshipExtEval.name;
        const insExtFed = USN + "_" + intenshipExtFed.name;

        setIsLoading(true);
        const res = await fetch("http://localhost:5000/api/ims", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            USN,
            batch,
            noOfInternship,
            nameOfIndustry,
            AddressOfIndustry,
            internshipDomain,
            startDate,
            endDate,
            weeksOfInternship,
            industryGuide,
            emailOfIndustryGuide,
            noOfIndustryGuide,
            stipendReceived,
            amountOfStipend,
            toBeEval,
            modeOfInternship,
            mentorName,
            insCert,
            insRep,
            insExtEval,
            insExtFed,
          }),
        });

        const result = await res.json();
        setIsLoading(false);

        if (res.status === 400 || !result) {
          window.alert(result.message);
        } else {
          await UploadFiles();

          window.alert(result.message);

          document.getElementById("student-form").reset();

          setName("");
          setusn("");
          setBatch("");
          setNoOfInternship("1st Internship");
          setNameOfIndustry("");
          setAddressOfIndustry("");
          setInternshipDomain("App Development");
          setStartDate("");
          setEndDate("");
          setWeeksOfInternship(0);
          setIndustryGuide("");
          setEmailOfIndustryGuide("");
          setNoOfIndustryGuide("");
          setStipendReceived("Yes");
          setAmountOfStipend("");
          setToBeEval("Yes");
          setModeOfInternship("Online");
          setMentorName("");
          setInternshipCert("");
          setInternshipReport("");
          setInternshipExtEval("");
          setIntenshipExtFed("");
        }
      }
    } catch (err) {
      window.alert(err.message);
    }
  };

  const UploadFiles = async () => {
    try {
      const formData = new FormData();
      formData.append("Internship_Certificate", internshipCert);
      formData.append("Internship_Report", internshipReport);
      formData.append("Internship_External_Evaluation", internshipExtEval);
      formData.append("Intenship_External_Fedback", intenshipExtFed);
      formData.append("usn", usn.toUpperCase());

      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/uploads", {
        method: "POST",
        headers: {
          usn: usn.toUpperCase(),
        },
        body: formData,
      });

      const result = await response.json();
      setIsLoading(false);

      if (!result || response.status === 500) {
        window.alert(result.message);
      } else {
        window.alert(result.message);
      }
    } catch (err) {
      window.alert(err.message);
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
      if (response.status === 500 || !result) {
        window.alert(result.message);
      } else {
        setBatches(result.message);
      }
    } catch (err) {
      window.alert(err.message);
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
      if (!result) {
        window.alert("Something went wrong please try again");
      } else {
        setMentors(result.message);
      }
    } catch (err) {
      window.alert(err.message);
    }
  };

  return (
    <div>
      {isLoading ? <Loading /> : ""}
      <nav>
        <img src={banner} alt="Banner" className="git-banner" />
        <h1>KLS Gogte Institute of Technology</h1>
      </nav>
      <div className="main-container">
        <div className="form-container">
          <form id="student-form" onSubmit={HandleSubmit}>
            <div className="row">
              <label className="column">
                Enter your Name:
                <input
                  className="input-col"
                  type="text"
                  value={name}
                  placeholder="Your Name"
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="column">
                Enter your USN:
                <input
                  className="input-col"
                  type="text"
                  value={usn}
                  placeholder="Your USN"
                  onChange={(e) => setusn(e.target.value)}
                />
              </label>
              <label className="column">
                Enter your Batch:
                <select
                  className="input-col"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                >
                  <option>Select Your Batch</option>
                  {batches.map((batch, i) => (
                    <option key={i} value={batch.batch}>
                      {batch.batch}
                    </option>
                  ))}
                </select>
              </label>
              <label className="column">
                No. of Internship:
                <select
                  className="input-col"
                  value={noOfInternship}
                  onChange={(e) => setNoOfInternship(e.target.value)}
                >
                  <option value="1st Internship">1st Internship</option>
                  <option value="2nd Internship">2nd Internship</option>
                  <option value="3rd Internship">3rd Internship</option>
                  <option value="4th Internship">4th Internship</option>
                  <option value="5ht Internship">5th Internship</option>
                </select>
              </label>
              <label className="column">
                Name of Industry:
                <input
                  className="input-col"
                  type="text"
                  value={nameOfIndustry}
                  placeholder="Name of Industry"
                  onChange={(e) => setNameOfIndustry(e.target.value)}
                />
              </label>
              <label className="column">
                Full Postal Address of Industry:
                <input
                  className="input-col"
                  type="text"
                  value={AddressOfIndustry}
                  placeholder="Full Postal Address of Industry"
                  onChange={(e) => setAddressOfIndustry(e.target.value)}
                />
              </label>
              <label className="column">
                Internship Domain:
                <select
                  className="input-col"
                  value={internshipDomain}
                  onChange={(e) => setInternshipDomain(e.target.value)}
                >
                  <option value="App Development">App Development</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Blockchain">Blockchain</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Artificial Intelligence">
                    Artificial Intelligence
                  </option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="Internet of Things">Internet of Things</option>
                  <option value="VLSI">VLSI</option>
                  <option value="Embedded Systems">Embedded Systems</option>
                  <option value="Robotics">Robotics</option>
                  <option value="Networking">Networking</option>
                  <option value="Communication">Communication</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label className="column">
                Start date:
                <input
                  className="input-col"
                  type="date"
                  value={startDate}
                  placeholder="Start date"
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </label>
              <label className="column">
                End Date:
                <input
                  className="input-col"
                  type="date"
                  value={endDate}
                  placeholder="End Date"
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </label>
              <label className="column">
                No. of Weeks of Internship:
                <input
                  className="input-col"
                  type="Number"
                  value={weeksOfInternship}
                  placeholder="No. of Weeks"
                  onChange={(e) => setWeeksOfInternship(e.target.value)}
                />
              </label>
              <label className="column">
                Name of Industry Guide:
                <input
                  className="input-col"
                  type="text"
                  value={industryGuide}
                  placeholder="Industry Guide Name"
                  onChange={(e) => setIndustryGuide(e.target.value)}
                />
              </label>
              <label className="column">
                Email Id of Industry Guide:
                <input
                  className="input-col"
                  type="text"
                  value={emailOfIndustryGuide}
                  placeholder="Email Id of Industry Guide"
                  onChange={(e) => setEmailOfIndustryGuide(e.target.value)}
                />
              </label>
              <label className="column">
                Contact No. of Industry Guide:
                <input
                  className="input-col"
                  type="text"
                  value={noOfIndustryGuide}
                  placeholder="Industry Guide Contact No."
                  onChange={(e) => setNoOfIndustryGuide(e.target.value)}
                />
              </label>
              <label className="column">
                Stipend Received:
                <select
                  className="input-col"
                  value={stipendReceived}
                  onChange={(e) => setStipendReceived(e.target.value)}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </label>
              <label className="column">
                Amount of Stipend Received:
                <input
                  className="input-col"
                  type="text"
                  value={amountOfStipend}
                  placeholder="Stipend in Rupees (Enter 0 if not applicable)"
                  onChange={(e) => setAmountOfStipend(e.target.value)}
                />
              </label>
              <label className="column">
                Do you want this internship to be evaluated:
                <select
                  className="input-col"
                  value={toBeEval}
                  onChange={(e) => setToBeEval(e.target.value)}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </label>
              <label className="column">
                Mode of internship carried out:
                <select
                  className="input-col"
                  value={modeOfInternship}
                  onChange={(e) => setModeOfInternship(e.target.value)}
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Blended">Blended</option>
                </select>
              </label>
              <label className="column">
                KLS GIT Internal Guide (Mentor):
                <select
                  className="input-col"
                  value={mentorName}
                  onChange={(e) => setMentorName(e.target.value)}
                >
                  <option>Select Your Mentor</option>
                  {mentors.map((mentor, i) => (
                    <option key={i} value={mentor.mentor}>
                      {mentor.mentor}
                    </option>
                  ))}
                </select>
              </label>
              <label className="column">
                Internship Certificate:
                <input
                  className="input-col"
                  type="file"
                  placeholder="Internship Certificate"
                  onChange={(e) => setInternshipCert(e.target.files[0])}
                />
              </label>
              <label className="column">
                Internship Report:
                <input
                  className="input-col"
                  type="file"
                  placeholder="Internship Report"
                  onChange={(e) => setInternshipReport(e.target.files[0])}
                />
              </label>
              <label className="column">
                Internship External Evaluation:
                <input
                  className="input-col"
                  type="file"
                  placeholder="Internship External Evaluation"
                  onChange={(e) => setInternshipExtEval(e.target.files[0])}
                />
              </label>
              <label className="column">
                Internship External Feedback:
                <input
                  className="input-col"
                  type="file"
                  placeholder="Internship External Feedback"
                  onChange={(e) => setIntenshipExtFed(e.target.files[0])}
                />
              </label>
            </div>
            <input className="submit-button" type="submit" value="Submit" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Home;
