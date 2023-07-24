const mongoose = require("mongoose");
const PgModel = require("../model/pgModel");
const express = require("express");
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

module.exports = router;
