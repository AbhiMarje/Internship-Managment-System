const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  usn: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  noOfInternship: {
    type: String,
    required: true,
  },
  nameOfIndustry: {
    type: String,
    required: true,
  },
  AddressOfIndustry: {
    type: String,
    required: true,
  },
  internshipDomain: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  weeksOfInternship: {
    type: String,
    required: true,
  },
  industryGuide: {
    type: String,
    required: true,
  },
  emailOfIndustryGuide: {
    type: String,
    required: true,
  },
  noOfIndustryGuide: {
    type: String,
    required: true,
  },
  stipendReceived: {
    type: String,
    required: true,
  },
  amountOfStipend: {
    type: String,
    required: true,
  },
  toBeEval: {
    type: String,
    required: true,
  },
  modeOfInternship: {
    type: String,
    required: true,
  },
  mentorName: {
    type: String,
    required: true,
  },
  internshipCert: {
    type: String,
    required: true,
  },
  internshipReport: {
    type: String,
    required: true,
  },
  internshipExtEval: {
    type: String,
    required: true,
  },
  intenshipExtFed: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("INTERNSHIPDATA", userSchema);

module.exports = User;
