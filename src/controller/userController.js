const RoomModel = require("../model/roomModel");
const UserModel = require("../model/usersModel");
const { CustomError } = require("../utils/customError");

const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const users = await UserModel.find(req.body).populate(
      "room"
    );
    res.status(200).send(users);
    return;
  } catch (e) {
    res.status(e.code ?? 500).send(e.message);
    return;
  }
});
router.get("/:id", async (req, res) => {
  try {
    const users = await UserModel.find({ room: req.params.id }).populate(
      "room"
    );
    res.status(200).send(users);
    return;
  } catch (e) {
    res.status(e.code ?? 500).send(e.message);
    return;
  }
});

//create a user
router.post("/", async (req, res) => {
  try {
    //check wheter room exists
    const room = await RoomModel.findOne({ _id: req.body.room }).lean().exec();
    if (!room) {
      res.status(400).send("invalid room");
      return;
    }
    // see whether room is full
    if(room.tenants.length >= room.sharingType){
      res.status(400).send("room is full");
      return;
    }

    const newUser = await UserModel.create(req.body);
    //update tenent details in room
    room.tenants[room.tenants.length] = newUser;
    const updatedRoom = await RoomModel.updateOne(room);
    console.log({newUser,updatedRoom,room})

    res
      .status(201)
      .send(`New user: ${(newUser.name, newUser._id)} added successfully!`);
    return;
  } catch (e) {
    res.status(e.code ?? 500).send(e.message);
    return;
  }
});

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
        return;
      } else throw CustomError("User not found!!", 400);
    } else throw CustomError("Invalid Id!", 400);
  } catch (e) {
    res.status(e.code ?? 500).send(e.message);
    return;
  }
});

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
      return;
    } else throw CustomError("Invalid User Id", 400);
  } catch (e) {
    res.status(e.code ?? 500).send(e.message);
    return;
  }
});





module.exports = router;
