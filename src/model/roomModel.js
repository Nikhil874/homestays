const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNo: { type: Number, required: true },
    noOfMembers: { type: Number, required: true },
    minRentPerPerson: { type: Number, required: true },
    floorId: { type: mongoose.Schema.Types.ObjectId, ref: "floorModel" },
    pgId: { type: mongoose.Schema.Types.ObjectId, ref: "pgModel" },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("roomModel", roomSchema);