const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  USN: {
    type: String,
    required: true,
  },
  Mentor: {
    type: String,
    required: true,
  },
  Batch: {
    type: String,
    required: true,
  },
});

const Student = mongoose.model("STUDENTS", studentSchema);

module.exports = Student;
