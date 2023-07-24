const mongoose = require("mongoose");

const floorSchema = new mongoose.Schema(
  {
    floorNo: { type: Number, required: true },
    noOfRooms: { type: Number, required: true },
    pgId:{type:mongoose.Schema.Types.ObjectId,ref:"pgModel"},
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("floorModel", floorSchema);