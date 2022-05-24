const express = require("express");
const router = express.Router();
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlinkSync);

router.use(cors());

const User = require("../models/userSchema.js");
const Batch = require("../models/Batch.js");
const Mentors = require("../models/Mentors.js");
const Student = require("../models/Student.js");

router.post("/api/download", (req, res) => {
  const { filename } = req.body;
  const file = "../public/uploads/" + filename;
  res.download(file);
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../public/uploads");
  },
  filename: (req, file, cb) => {
    const { usn, noofinternships } = req.headers;
    if (noofinternships === "1st Internship") {
      cb(null, usn + "_" + "1st" + "_" + file.originalname);
    } else if (noofinternships === "2nd Internship") {
      cb(null, usn + "_" + "2nd" + "_" + file.originalname);
    } else if (noofinternships === "3rd Internship") {
      cb(null, usn + "_" + "3rd" + "_" + file.originalname);
    } else if (noofinternships === "4th Internship") {
      cb(null, usn + "_" + "4th" + "_" + file.originalname);
    } else if (noofinternships === "5th Internship") {
      cb(null, usn + "_" + "5th" + "_" + file.originalname);
    }
  },
});

var upload = multer({ storage: storage });

router.post(
  "/api/uploads",
  upload.fields([
    {
      name: "Internship_Certificate",
      maxCount: 1,
    },
    {
      name: "Internship_Report",
      maxCount: 1,
    },
    {
      name: "Internship_External_Evaluation",
      maxCount: 1,
    },
    {
      name: "Intenship_External_Fedback",
      maxCount: 1,
    },
  ]),
  (req, res) => {
    try {
      return res.status(200).json({ message: "Files uploaded successfully" });
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Something went wrong please try again" });
    }
  }
);

router.post("/api/login", (req, res) => {
  try {
    const { username, password } = req.body;
    if (username && password) {
      if (username === "ims_git" && password === "ims_git@9678") {
        res.status(200).json({ message: "Login Successful" });
      } else {
        res.status(400).json({ error: "Invalid Credentials" });
      }
    } else {
      return res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (err) {
    res.status(400).json({ error: "Something went wrong please try again" });
  }
});

router.post("/api/deleteStudentByUSN", async (req, res) => {
  try {
    const { studentDeleteUsn } = req.body;
    if (studentDeleteUsn) {
      await Student.findOne({ USN: studentDeleteUsn }, async (err, data) => {
        if (err) {
          return res.status(400).json({ error: "Something went wrong" });
        } else {
          if (data) {
            await Student.findOneAndDelete(
              { USN: studentDeleteUsn },
              (err, doc) => {
                if (err) {
                  return res
                    .status(400)
                    .json({ error: "Something went wrong" });
                } else {
                  res
                    .status(200)
                    .json({ message: "User deleted successfully" });
                }
              }
            ).clone();
          }
        }
      });
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong please try again" });
  }
});

router.post("/api/deleteStudentByBatch", async (req, res) => {
  try {
    const { studentDeleteBatch } = req.body;
    if (studentDeleteBatch) {
      await Student.deleteMany({ Batch: studentDeleteBatch }, (err, doc) => {
        if (err) {
          return res.status(400).json({ error: "Something went wrong" });
        } else {
          res.status(200).json({ message: "Users deleted successfully" });
        }
      }).clone();
    } else {
      res.status(400).json({ message: "Users not found" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong please try again" });
  }
});

router.post("/api/deleteUserByUSN", async (req, res) => {
  try {
    const { deleteUsn } = req.body;
    const usn = deleteUsn.toUpperCase();
    if (deleteUsn) {
      await User.findOne({ USN: usn }, async (err, user) => {
        if (err) {
          res.status(400).json({ message: "Something went wrong" });
        } else {
          if (user) {
            unlinkAsync("../public/uploads/" + user.insCert);
            unlinkAsync("../public/uploads/" + user.insRep);
            unlinkAsync("../public/uploads/" + user.insExtEval);
            unlinkAsync("../public/uploads/" + user.insExtFed);
            await User.findOneAndDelete({ USN: usn }, (err, user) => {
              if (err) {
                res.status(400).json({ message: "Something went wrong" });
              } else {
                res.status(200).json({ message: "User deleted successfully" });
              }
            }).clone();
          } else {
            res.status(400).json({ message: "User not found" });
          }
        }
      }).clone();
    } else {
      res
        .status(400)
        .json({ message: "Something went wrong please try again" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong please try again" });
  }
});

router.post("/api/deleteUsersByBatch", async (req, res) => {
  const { deleteBatch } = req.body;
  if (deleteBatch) {
    try {
      await User.find({ batch: deleteBatch }, (err, result) => {
        if (err) {
          res.status(500).json({ message: "Error Deleting Users" });
        } else {
          if (result.length > 0) {
            result.forEach(async (user) => {
              unlinkAsync("../public/uploads/" + user.insCert);
              unlinkAsync("../public/uploads/" + user.insRep);
              unlinkAsync("../public/uploads/" + user.insExtEval);
              unlinkAsync("../public/uploads/" + user.insExtFed);
              await User.findOneAndDelete({ USN: user.USN }, (err, result) => {
                if (err) {
                  res.status(500).json({ message: "Error Deleting User" });
                }
              }).clone();
            });
            res.status(200).json({ message: "Users Deleted Successfully" });
          } else {
            res.status(400).json({ message: "No Users Found" });
          }
        }
      }).clone();
    } catch (err) {
      res
        .status(500)
        .json({ message: "Something went wrong please try again" });
    }
  } else {
    res.status(400).json({ message: "Something went wrong please try again" });
  }
});

router.post("/api/deleteUsersByMentor", async (req, res) => {
  const { deleteMentor } = req.body;
  if (deleteMentor) {
    try {
      await User.find({ mentorName: deleteMentor }, (err, result) => {
        if (err) {
          res.status(500).json({ message: "Error Deleting Users" });
        } else {
          if (result.length > 0) {
            result.forEach(async (user) => {
              unlinkAsync("../public/uploads/" + user.insCert);
              unlinkAsync("../public/uploads/" + user.insRep);
              unlinkAsync("../public/uploads/" + user.insExtEval);
              unlinkAsync("../public/uploads/" + user.insExtFed);
              await User.findOneAndDelete({ USN: user.USN }, (err, result) => {
                if (err) {
                  res.status(500).json({ message: "Error Deleting User" });
                }
              }).clone();
            });
            res.status(200).json({ message: "Users Deleted Successfully" });
          } else {
            res.status(400).json({ message: "No Users Found" });
          }
        }
      }).clone();
    } catch (err) {
      res
        .status(500)
        .json({ message: "Something went wrong please try again" });
    }
  } else {
    res.status(400).json({ message: "Something went wrong please try again" });
  }
});

router.post("/api/deleteMentor", async (req, res) => {
  const { mentor } = req.body;
  if (mentor) {
    try {
      await Mentors.findOneAndDelete({ mentor: mentor }, (err, data) => {
        if (err) {
          res.status(500).json({ message: "Error deleting mentor" });
        } else if (!data) {
          res.status(500).json({ message: "Mentor not found" });
        } else {
          res.status(200).json({ message: "Mentor Deleted Successfully" });
        }
      }).clone();
    } catch (err) {
      res.json({ message: "Something went wrong please try again" });
    }
  } else {
    res.status(400).json({ message: "Something went wrong please try again" });
  }
});

router.post("/api/deleteBatch", async (req, res) => {
  const { batch } = req.body;
  if (batch) {
    try {
      await Batch.findOneAndDelete({ batch: batch }, (err, data) => {
        if (err) {
          res.status(500).json({ message: "Error deleting batch" });
        } else if (!data) {
          res.status(500).json({ message: "Batch not found" });
        } else {
          res.status(200).json({ message: "Batch Deleted Successfully" });
        }
      }).clone();
    } catch (err) {
      res.json({ message: "Something went wrong please try again" });
    }
  } else {
    res.status(400).json({ message: "Something went wrong please try again" });
  }
});

router.post("/api/addNewMentor", async (req, res) => {
  try {
    const { mentor } = req.body;
    if (mentor) {
      const newMentor = new Mentors({
        mentor,
      });
      await newMentor.save();
      res.status(200).json({ message: "Mentor added successfully" });
    } else {
      res
        .status(400)
        .json({ message: "Something went wrong please try again" });
    }
  } catch (err) {
    res.json({ message: "Something went wrong please try again" });
  }
});

router.get("/api/getMentors", async (req, res) => {
  try {
    await Mentors.find({}, (err, mentors) => {
      if (err) {
        res.status(500).json({ message: null, error: "Error getting Mentors" });
      } else {
        res.status(200).json({ message: mentors });
      }
    }).clone();
  } catch (err) {
    res.json({ message: null, error: "Something went wrong please try again" });
  }
});

router.get("/api/getBatches", async (req, res) => {
  try {
    await Batch.find({}, (err, batches) => {
      if (err) {
        res.status(500).json({ message: null, error: "Error getting Batches" });
      } else if (batches) {
        res.status(200).json({ message: batches });
      }
    }).clone();
  } catch (err) {
    res.json({ message: null, error: "Something went wrong please try again" });
  }
});

router.post("/api/addNewBatch", async (req, res) => {
  try {
    const { batch } = req.body;
    if (batch) {
      const newBatch = new Batch({
        batch,
      });
      await newBatch.save();
      res.status(200).json({ message: "Batch added successfully" });
    } else {
      res
        .status(500)
        .json({ message: "Something went wrong please try again" });
    }
  } catch (err) {
    res.json({ message: "Something went wrong please try again" });
  }
});

router.post("/api/getStudentsWithNoInternship", async (req, res) => {
  try {
    const { loadBatch } = req.body;
    if (loadBatch) {
      await Student.find({ Batch: loadBatch }, (err, students) => {
        if (err) {
          res
            .status(500)
            .json({ message: null, error: "Error getting Students" });
        } else if (students) {
          res.status(200).json({ message: students });
        }
      }).clone();
    } else {
      res.status(500).json({ message: "Error getting data" });
    }
  } catch (err) {
    res.json({ message: null, error: "Something went wrong please try again" });
  }
});

router.get("/api/getAllData", async (req, res) => {
  try {
    await User.find({}, (err, data) => {
      if (err) {
        res.status(500).json({ message: "Error getting data" });
      } else if (data.length === 0) {
        res.status(200).json({ message: null, error: "No data found" });
      } else {
        res.status(200).json({ message: data });
      }
    }).clone();
  } catch (err) {
    res.json({ message: "Something went wrong please try again" });
  }
});

router.post("/api/getDataByUSN", async (req, res) => {
  try {
    const { usn } = req.body;
    if (usn) {
      await User.find({ usn: usn }, (err, data) => {
        if (err) {
          res.status(500).json({ message: "Error getting data" });
        } else if (data.length === 0) {
          res.status(200).json({ message: null, error: "No data found" });
        } else {
          res.status(200).json({ message: data });
        }
      }).clone();
    } else {
      res.status(500).json({ message: "Error getting data" });
    }
  } catch (err) {
    res.json({ message: "Something went wrong please try again" });
  }
});

router.post("/api/getAllCompanyList", async (req, res) => {
  try {
    const { batch } = req.body;
    if (batch) {
      await User.find({ batch: batch }, (err, data) => {
        if (err) {
          res.status(500).json({ message: "Error getting data" });
        } else if (data.length === 0) {
          res.status(200).json({ message: null, error: "No data found" });
        } else {
          res.status(200).json({ message: data });
        }
      }).clone();
    } else {
      res.status(500).json({ message: "Error getting data" });
    }
  } catch (err) {
    res.json({ message: "Something went wrong please try again" });
  }
});

router.post("/api/getDataByBatch", async (req, res) => {
  try {
    const { batch } = req.body;
    if (batch) {
      await User.find({ batch: batch }, (err, data) => {
        if (err) {
          res.status(500).json({ message: "Error getting data" });
        } else if (data.length === 0) {
          res.status(200).json({ message: null, error: "No data found" });
        } else {
          res.status(200).json({ message: data });
        }
      }).clone();
    } else {
      res.status(500).json({ message: "Error getting data" });
    }
  } catch (err) {
    res.json({ message: "Something went wrong please try again" });
  }
});

router.post("/api/getDataByMentor", async (req, res) => {
  try {
    const { mentor } = req.body;
    if (mentor) {
      await User.find({ mentorName: mentor }, (err, data) => {
        if (err) {
          res.status(500).json({ message: "Error getting data" });
        } else if (data.length === 0) {
          res.status(200).json({ message: null, error: "No data found" });
        } else {
          res.status(200).json({ message: data });
        }
      }).clone();
    } else {
      res.status(500).json({ message: "Error getting data" });
    }
  } catch (err) {
    res.json({ message: "Something went wrong please try again" });
  }
});

router.post("/api/uploadStudentData", async (req, res) => {
  try {
    const { studentjsonData } = req.body;
    if (studentjsonData) {
      studentjsonData.forEach(async (student) => {
        const newStudent = new Student({
          USN: student.USN,
          Name: student.Name,
          Mentor: student.Mentor,
          Batch: student.Batch,
        });
        await newStudent.save();
      });
      res.status(200).json({ message: "Data uploaded successfully" });
    } else {
      res.status(500).json({ error: "Error uploading data" });
    }
  } catch (err) {
    res.json({ error: "Something went wrong please try again" });
  }
});

router.post("/api/ims", async (req, res) => {
  try {
    const {
      name,
      USN,
      batch,
      mentorName,
      noOfInternship,
      nameOfIndustry,
      AddressOfIndustry,
      internshipDomain,
      startDate,
      endDate,
      weeksOfInternship,
      noOfMonths,
      industryGuide,
      emailOfIndustryGuide,
      noOfIndustryGuide,
      stipendReceived,
      amountOfStipend,
      toBeEval,
      modeOfInternship,
      insCert,
      insRep,
      insExtEval,
      insExtFed,
    } = req.body;

    if (
      !name ||
      !USN ||
      !batch ||
      !noOfInternship ||
      !nameOfIndustry ||
      !AddressOfIndustry ||
      !internshipDomain ||
      !startDate ||
      !endDate ||
      !weeksOfInternship ||
      !noOfMonths ||
      !industryGuide ||
      !emailOfIndustryGuide ||
      !noOfIndustryGuide ||
      !stipendReceived ||
      !amountOfStipend ||
      !toBeEval ||
      !modeOfInternship ||
      !mentorName ||
      !insCert ||
      !insRep ||
      !insExtEval ||
      !insExtFed
    ) {
      res.status(400).json({ message: "Please fill all the fields" });
    } else {
      const user = new User({
        name,
        USN,
        batch,
        mentorName,
        noOfInternship,
        nameOfIndustry,
        AddressOfIndustry,
        internshipDomain,
        startDate,
        endDate,
        weeksOfInternship,
        noOfMonths,
        industryGuide,
        emailOfIndustryGuide,
        noOfIndustryGuide,
        stipendReceived,
        amountOfStipend,
        toBeEval,
        modeOfInternship,
        insCert,
        insRep,
        insExtEval,
        insExtFed,
      });

      await user.save();

      console.log(await deleteUser(USN));

      res.status(200).json({ message: "Submiited Successfully" });
    }
  } catch (err) {
    res.json({ message: "Something went wrong please try again" });
  }
});

async function deleteUser(USN) {
  var isDeleted = "false";
  try {
    await Student.findOneAndDelete({ USN: USN }, (err, data) => {
      if (err) {
        isDeleted = "false";
      } else {
        isDeleted = "true";
      }
    }).clone();
  } catch (err) {
    isDeleted = "false";
  }
  return isDeleted;
}

module.exports = router;
