const RoomModel = require("../model/roomModel");
const UserModel = require("../model/usersModel");
const { CustomError } = require("../utils/customError");

const router = require("express").Router();


router.get("/", async (req, res) => {
  try {
    const users = await UserModel.find(req.body).populate("room");
    res.status(200).send(users);
    
  } catch (e) {
    res.status(e.code ?? 500).send(e.message);
  }
})

//create a user
router.post("/", async (req, res) => {
  try {
    req.body.room = null;
    const newUser = await UserModel.create(req.body);
    res.status(201).send(`New user: ${newUser.name,newUser._id} added successfully!`);
  } catch (e) {
    res.status(e.code ?? 500).send(e.message);
  }
})


//update a user's name,startDate,amount;
router.patch("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    if (!!userId) {
      const user = await UserModel.findOne({ _id: userId }).populate("room");
      if (user) {
        if (req.body?.room) {
          delete req.body.room; // removing the room from request of present
        }
        await room.updateOne(req.body);
        res.status(200).send("Room successfully updated");
      } else throw CustomError("User not found!!", 400);
    } else throw CustomError("Invalid Id!", 400);
  } catch (e) {
    res.status(e.code ?? 500).send(e.message);
  }
})
  

//delete a user
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    if (!!userId) {
      // see how to do using pre hooks
      const user = await UserModel.findOne({ _id: userId });
      if (user.room) {
        const room = await RoomModel.findOne({ _id: user.room });
        room.tenants = room.tenants.filter((tenant) => tenant != userId);
        room.save();
      }
      const response = await UserModel.deleteOne({ _id: userId });
      if (!response?.deletedCount) throw CustomError("Invalid User Id", 400);
      res.status(200).send("User successfully deleted!");
    } else throw CustomError("Invalid User Id", 400);
  } catch (e) {
    res.status(e.code ?? 500).send(e.message);
  }
})


module.exports = router;