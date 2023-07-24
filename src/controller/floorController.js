const mongoose = require("mongoose");
const FloorModel = require("../model/floorModel");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let floorData = await FloorModel.find().lean().exec();
    res.status(200).send(floorData);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.post("/", async (req, res) => {
  try {
    let floorData = await FloorModel.create(req.body);
    res.status(201).send("floor added successfully");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = router;
