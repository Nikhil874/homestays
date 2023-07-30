const mongoose = require("mongoose");
const RoomModel = require("../model/roomModel");
const FloorModel = require("../model/floorModel");
const express = require("express");
const { CustomError } = require("../utils/customError");
const usersModel = require("../model/usersModel");
const { updateTenantArrOperations } = require("../constants");
const router = express.Router();

async function isRoomNumberExistsOnFloor(floorId, newRoomNo) {
  const rooms = await RoomModel.find(floorId);
  const roomNumbers = rooms?.map((room) => room.roomNo);
  return roomNumbers?.includes(newRoomNo);
}

//show rooms
router.get("/:id", async (req, res) => {
  try {
    let roomData = await RoomModel.find({ floorId: req.params.id });
    // .populate("pgId")
    // .populate("floorId");
    res.status(200).send(roomData);
    return;
  } catch (e) {
    res.status(500).send(e.message);
    return;
  }
});

//get single room details
router.get("/roomDetails/:id", async (req, res) => {
  try {
    let roomData = await RoomModel.findOne({ _id: req.params.id });
    // .populate("pgId")
    // .populate("floorId");
    res.status(200).send(roomData);
    return;
  } catch (e) {
    res.status(500).send(e.message);
    return;
  }
});

//create a room
router.post("", async (req, res) => {
  try {
    // check if rooms limit for floor reached
    const rooms = await RoomModel.find({ floorId: req.body.floorId });
    const roomsPerFloor = await FloorModel.find({ _id: req.body.floorId });
    if (roomsPerFloor[0].noOfRooms) {
      if (!!roomsPerFloor?.length) {
        if (!(roomsPerFloor[0].noOfRooms >= rooms.length)) {
          throw CustomError("No room available on this floor!", 400);
          return;
        }
        //check if room number exists
        const roomNumberExists = await isRoomNumberExistsOnFloor(
          req.floorId,
          req.body.roomNo
        );
        if (roomNumberExists) {
          throw CustomError(
            "Room number already taken.Please choose another number",
            400
          );
          return;
        }

        req.body.tenants = [];
        await RoomModel.create(req.body);
        res.status(201).send("Room added successfully!");
        return;
      }
    } else {
      throw customError("No rooms in this floor", 400);
      return;
    }
  } catch (e) {
    res.status(e.code ?? 500).send(e.message);
    return;
  }
});

//delete a room
router.delete("/:id", async (req, res) => {
  try {
    const roomId = req.params.id;
    if (!!roomId) {
      const response = await RoomModel.deleteOne({ _id: roomId });
      if (!response?.deletedCount) {
        throw CustomError("Invalid Room Id", 400);
        return;
      }
      res.status(200).send("Room successfully deleted!");
      return;
    } else {
      throw CustomError("Invalid Room Id", 400);
      return;
    }
  } catch (e) {
    res.status(e.code ?? 500).send(e.message);
    return;
  }
});

router.patch("/updateTenantArr", async (req, res) => {
  try {
    const { userId = null, roomId = null, operation = "Add" } = req.body;
    if (!userId || !roomId) {
      throw new CustomError("Invalid Id!");
      return;
    }
    const room = await RoomModel.findOne({ _id: roomId });
    if (room) {
      const user = await usersModel.findOne({ _id: userId });
      if (user) {
        room.tenants = room.tenants.filter((tenant) => tenant != userId);

        if (operation === updateTenantArrOperations.ADD) {
          room.tenants.push(userId);
          user.room = roomId;
        } else if (updateTenantArrOperations.DELETE) {
          user.room = null;
        }

        user.save();
        room.save();
        res
          .status(200)
          .send(
            `Operation: ${operation} performed successfully on tenant array!`
          );
      } else throw new CustomError("No user found!", 404);
    } else {
    }
  } catch (e) {
    res.status(e.code ?? 500).send(e.message);
  }
});

// update a room
router.patch("/:id", async (req, res) => {
  try {
    const roomId = req.params.id;
    if (!!roomId) {
      const room = await RoomModel.findOne({ _id: roomId });
      if (room) {
        //check if room number exists
        if (req.body.roomNo) {
          const roomNumberExists = await isRoomNumberExistsOnFloor(
            req.floorId,
            req.body.roomNo
          );
          if (roomNumberExists)
            throw CustomError(
              "Room number already taken.Please choose another number",
              400
            );
        }
        await room.updateOne(req.body);
        res.status(200).send("Room successfully updated");
        return;
      } else throw CustomError("Room not found!!", 400);
    } else throw CustomError("Invalid Id!!", 400);
  } catch (e) {
    res.status(e.code ?? 500).send(e.message);
  }
});
module.exports = router;
