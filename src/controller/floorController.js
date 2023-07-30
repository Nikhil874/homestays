const mongoose = require("mongoose");
const FloorModel = require("../model/floorModel");
const express = require("express");
const floorModel = require("../model/floorModel");
const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    if(!req.params.id){
      res.status(400).send("Invalid request");
      return;
    }
    let floorData = await FloorModel.find({ pgId: req.params.id });
    res.status(200).send(floorData);
    return;
  } catch (e) {
    res.status(500).send(e.message);
    return;
  }
});

router.post("/", async (req, res) => {
  try {
    const { floorNo } = req.body;
    let findFloor = await FloorModel.findOne({ floorNo,pgId:req.body.pgId });
    if (!!findFloor) {
      res.status(400).send("floor already added");
      return;
    }
    let floorData = await FloorModel.create(req.body);
    res.status(201).send("floor added successfully");
    return;
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
            return;
          }
        }
        //update floor
        await findFloor.updateOne(req.body);
        res.status(200).send("Floor successfully updated");
        return;
      } else {
        res.status(404).send("Floor ot found");
        return;
      }
    } else {
      res.status(400).send("Invalid Id");
      return;
    }
  } catch (e) {
    res.status(e.code ?? 500).send(e.message);
    return;
  }
});

router.delete("/:id", async (req, res) => {
  const floorId = req.params.id;
  if (!floorId) {
    res.status(400).send("Invalid Id");
    return;
  } else {
    try {
      const findFloor = await floorModel.findOne({ _id: floorId });
      if (!findFloor) {
        res.status(404).send("Floor ot found");
        return;
      }
      await floorModel.deleteOne({ _id: floorId });
      res.status(200).send("floor deleted successfully");
      return;
    } catch (e) {
      res.status(500).send(e.message);
      return;
    }
  }
});

module.exports = router;
