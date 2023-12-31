const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNo: { type: String,required: true },
    minRentPerPerson: { type: Number, required: true },
    floorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "floorModel",
      required: true,
    },
    pgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pgModel",
      required: true,
    },
    sharingType:{ type: Number, required: true },
    tenants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("roomModel", roomSchema);