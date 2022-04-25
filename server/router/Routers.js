const express = require("express");
const router = express.Router();
const cors = require("cors");
const multer = require("multer");

router.use(cors());

const User = require("../models/userSchema.js");
const Batch = require("../models/Batch.js");
const Mentors = require("../models/Mentors.js");

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
    cb(null, req.headers.usn + "_" + file.originalname);
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

router.post("/api/deleteMentor", async (req, res) => {
  const { mentor } = req.body;
  try {
    await Mentors.findOneAndDelete({ mentor: mentor }, (err, data) => {
      if (err) {
        res.status(500).json({ message: "Error deleting mentor" });
      } else {
        res.status(200).json({ message: data });
      }
    }).clone();
  } catch (err) {
    res.json({ message: "Something went wrong please try again" });
  }
});

router.post("/api/deleteBatch", async (req, res) => {
  const { batch } = req.body;
  try {
    await Batch.findOneAndDelete({ batch: batch }, (err, data) => {
      if (err) {
        res.status(500).json({ message: "Error deleting batch" });
      } else {
        res.status(200).json({ message: data });
      }
    }).clone();
  } catch (err) {
    res.json({ message: "Something went wrong please try again" });
  }
});

router.post("/api/addNewMentor", async (req, res) => {
  try {
    const { mentor } = req.body;
    const newMentor = new Mentors({
      mentor,
    });
    await newMentor.save();
    res.status(200).json({ message: "Mentor added successfully" });
  } catch (err) {
    res.json({ message: "Something went wrong please try again" });
  }
});

router.get("/api/getMentors", async (req, res) => {
  try {
    await Mentors.find({}, (err, mentors) => {
      if (err) {
        res.status(500).json({ message: "Error getting mentors" });
      } else {
        res.status(200).json({ message: mentors });
      }
    }).clone();
  } catch (err) {
    res.json({ message: "Something went wrong please try again" });
  }
});

router.get("/api/getBatches", async (req, res) => {
  try {
    await Batch.find({}, (err, batches) => {
      if (err) {
        res.status(500).json({ message: "Error getting batches" });
      } else if (batches) {
        res.status(200).json({ message: batches });
      }
    }).clone();
  } catch (err) {
    res.json({ message: "Something went wrong please try again" });
  }
});

router.post("/api/addNewBatch", async (req, res) => {
  try {
    const { batch } = req.body;
    const newBatch = new Batch({
      batch,
    });
    await newBatch.save();
    res.status(200).json({ message: "Batch added successfully" });
  } catch (err) {
    res.json({ message: "Something went wrong please try again" });
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
    await User.find({ usn: usn }, (err, data) => {
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

router.post("/api/getDataByBatch", async (req, res) => {
  try {
    const { batch } = req.body;
    await User.find({ batch: batch }, (err, data) => {
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

router.post("/api/getDataByMentor", async (req, res) => {
  try {
    const { mentor } = req.body;
    await User.find({ mentorName: mentor }, (err, data) => {
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

router.post("/api/ims", async (req, res) => {
  try {
    const {
      name,
      usn,
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
    } = req.body;

    if (
      !name ||
      !usn ||
      !batch ||
      !noOfInternship ||
      !nameOfIndustry ||
      !AddressOfIndustry ||
      !internshipDomain ||
      !startDate ||
      !endDate ||
      !weeksOfInternship ||
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
        usn,
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
      });

      await user.save();

      res.status(200).json({ message: "Submiited Successfully" });
    }
  } catch (err) {
    res.json({ message: "Something went wrong please try again" });
  }
});

module.exports = router;
