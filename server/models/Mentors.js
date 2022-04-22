const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema({
  mentor: {
    type: String,
    required: true,
  },
});

const Mentors = mongoose.model("MENTOR", mentorSchema);

module.exports = Mentors;
