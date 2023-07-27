const mongoose = require("mongoose");
const PgModel = require("../model/pgModel");
const express = require("express");
const pgModel = require("../model/pgModel");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let pgData = await PgModel.find().lean().exec();
    res.status(200).send(pgData);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.post("/", async (req, res) => {
  try {
    let pgData = await PgModel.create(req.body);
    res.status(201).send("pg added successfully");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

//update pg
router.patch("/:id", async (req, res) => {
  try {
    const pgId = req.params.id;
    if (!pgId) res.status(400).send("invalid id");
    const findPg = await PgModel.findOne({ _id: pgId });
    if (!findPg) res.status(404).send("Pg not found");
    await findPg.updateOne(req.body);
    res.status(200).send("pg has been updated");
  } catch (e) {}
});

module.exports = router;
