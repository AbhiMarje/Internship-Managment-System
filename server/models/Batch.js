const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  batch: {
    type: String,
    required: true,
  },
});

const Batch = mongoose.model("BATCH", batchSchema);

module.exports = Batch;
