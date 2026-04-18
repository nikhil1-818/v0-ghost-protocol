const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: String,
  size: Number,
  status: {
    type: String,
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("File", fileSchema);
