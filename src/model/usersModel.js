const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "roomModel" },
    paid: { type: Boolean, default: false },
    mobileNo: { type: String, required: false },
  },
  { timestamps: true, versionKey: false }
);

userSchema.path("mobileNo").validate(function (v) {
  return v.length == 10;
}, "Mobile number should be of 10 digits.");

// userSchema.pre("deleteOne", async function (req, res) {
//   const rooms
//   room.tenants = room.tenants.filter((tenant) => tenant != userId);
//   console.log("called pre",this._conditions,req.rooms)
// })

module.exports = mongoose.model("userModel", userSchema);
