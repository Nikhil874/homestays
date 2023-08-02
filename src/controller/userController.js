const RoomModel = require("../model/roomModel");
const UserModel = require("../model/usersModel");
const { CustomError } = require("../utils/customError");

const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    let { page = 1, size = 1 } = req.query;
    page = Number(page);
    size = Number(size);
    let noOfPages = 0,
      startingIndex = 0,
      endingIndex = 0;
    const users = await UserModel.find(req.body).populate(
      "room"
    );
    if (!!users?.length) {
      noOfPages = Math.ceil(users.length / size);
      startingIndex = (page - 1) * size;
      endingIndex = startingIndex + size;
    }
    const response = !!users?.length ? users.slice(startingIndex, endingIndex) : users;
    res
      .status(200)
      .send({ response, noOfPages, totalEntries: users?.length ?? 0 });
    return;
  } catch (e) {
    res.status(500).send(e.message);
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
    res.status(500).send(e.message);
    return;
  }
});

//update a user's name,startDate,amount;
router.post("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    if (!!userId) {
      const user = await UserModel.findOne({ _id: userId });
      if (user) {
        await user.updateOne(req.body);
        res.status(200).send("user successfully updated");
        return;
      } else throw CustomError("User not found!!", 400);
    } else throw CustomError("Invalid Id!", 400);
  } catch (e) {
    res.status(500).send(e.message);
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
    // see whether room  full
    if(room.tenants.length >= room.sharingType){
      res.status(400).send("room is full");
      return;
    }

    const newUser = await UserModel.create(req.body);
    //update tenent details in room
    room.tenants[room.tenants.length] = newUser?._id;
    delete room["_id"];
    const updatedRoom = await RoomModel.findByIdAndUpdate(req.body.room,room)
    

    res
      .status(201)
      .send(`New user: ${(newUser.name, newUser._id)} added successfully!`);
    return;
  } catch (e) {
    res.status(500).send(e.message);
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
        delete room["_id"];
        const updatedRoom = await RoomModel.findByIdAndUpdate(user.room,room)
      }
      const response = await UserModel.deleteOne({ _id: userId });
      if (!response?.deletedCount) throw CustomError("Invalid User Id", 400);
      res.status(200).send("User successfully deleted!");
      return;
    } else throw CustomError("Invalid User Id", 400);
  } catch (e) {
    res.status(500).send(e.message);
    return;
  }
});





module.exports = router;
