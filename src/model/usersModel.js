const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "roomModel" },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("userModel", userSchema);