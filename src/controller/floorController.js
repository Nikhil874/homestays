const mongoose = require("mongoose");
const FloorModel = require("../model/floorModel");
const express = require("express");
const floorModel = require("../model/floorModel");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let floorData = await FloorModel.find();
    res.status(200).send(floorData);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const { floorNo } = req.body;
    let findFloor = await FloorModel.findOne({ floorNo });
    if (!!findFloor) {
      res.status(400).send("floor already added");
    }
    let floorData = await FloorModel.create(req.body);
    res.status(201).send("floor added successfully");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const floorId = req.params.id;
    if (!!floorId) {
      const findFloor = await FloorModel.findOne({ _id: floorId });
      if (!!findFloor) {
        //check if floor no already exists
        if (req.body.floorNo) {
          let findFloorNo = await FloorModel.find({
            floorNo: req.body.floorNo,
          });
          if (!!findFloorNo) {
            res.status(400).send("floor already added");
          }
        }
        //update floor
        await findFloor.updateOne(req.body);
        res.status(200).send("Floor successfully updated");
      } else {
        res.status(404).send("Floor ot found");
      }
    } else {
      res.status(400).send("Invalid Id");
    }
  } catch (e) {
    res.status(e.code ?? 500).send(e.message);
  }
});

router.delete("/:id", async (req, res) => {
  const floorId = req.params.id;
  if (!floorId) {
    res.status(400).send("Invalid Id");
  } else {
    try {
      const findFloor = floorModel.findOne({ _id: floorId });
      if (!findFloor) {
        res.status(404).send("Floor ot found");
      }
      await floorModel.deleteOne({ _id: floorId });
      res.status(200).send("floor deleted successfully");
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
});

module.exports = router;
