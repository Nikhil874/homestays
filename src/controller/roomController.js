const mongoose = require("mongoose");
const RoomModel = require("../model/roomModel");
const FloorModel = require("../model/floorModel");
const express = require("express");
const router = express.Router();

async function isRoomNumberExistsOnFloor(floorId, newRoomNo) {
  const rooms = await RoomModel.find(floorId);
  const roomNumbers = rooms?.map((room) => room.roomNo);
  return roomNumbers?.includes(newRoomNo);
}

function CustomError(message, code) {
  const error = new Error(message);
  error.code = code;
  return error;
}

//show rooms
router.get("", async (req, res) => {
  try {
    let roomData = await RoomModel.find(req.body);
    // .populate("pgId")
    // .populate("floorId");
    res.status(200).send(roomData);
  } catch (e) {
    res.status(500).send(e.message);
  }
});
//create a room
router.post("", async (req, res) => {
  try {
    // check if rooms limit for floor reached
    const rooms = await RoomModel.find(req.floorId);
    const roomsPerFloor = await FloorModel.find(req.floorId);
    if (!!roomsPerFloor?.length && !!rooms?.length) {
      if (!(roomsPerFloor[0].noOfRooms >= rooms.length))
        throw CustomError("No room available on this floor!", 400);
      //check if room number exists
      // const roomNumbers = rooms?.map(room => room.roomNo)
      const roomNumberExists = await isRoomNumberExistsOnFloor(
        req.floorId,
        req.body.roomNo
      );
      if (roomNumberExists)
        throw CustomError(
          "Room number already taken.Please choose another number",
          400
        );
      let roomData = await RoomModel.create(req.body);
      res.status(201).send("Room added successfully");
    }
  } catch (e) {
    res.status(e.code ?? 500).send(e.message);
  }
});

//delete a room
router.delete("/:id", async (req, res) => {
  try {
    const roomId = req.params.id;
    if (!!roomId) {
      const response = await RoomModel.deleteOne({ _id: roomId });
      if (!response?.deletedCount) throw CustomError("Invalid Room Id", 400);
      res.status(200).send("Room successfully deleted!");
    } else throw CustomError("Invalid Room Id", 400);
  } catch (e) {
    res.status(e.code ?? 500).send(e.message);
  }
});

//update a room
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
      } else throw CustomError("Room not found!!", 400);
    } else throw CustomError("Invalid Id!!", 400);
  } catch (e) {
    res.status(e.code ?? 500).send(e.message);
  }
});

module.exports = router;
