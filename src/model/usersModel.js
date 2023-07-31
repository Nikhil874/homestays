const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "roomModel" },
    paid:{type:Boolean,default:false}
  },
  { timestamps: true, versionKey: false }
);

// userSchema.pre("deleteOne", async function (req, res) {
//   const rooms  
//   room.tenants = room.tenants.filter((tenant) => tenant != userId);
//   console.log("called pre",this._conditions,req.rooms) 
// })

module.exports = mongoose.model("userModel", userSchema);