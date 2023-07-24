const mongoose = require("mongoose");

const pgSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    noOfFloors: { type: Number, required: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("pgModel", pgSchema);
