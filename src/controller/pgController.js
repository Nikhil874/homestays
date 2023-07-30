const mongoose = require("mongoose");
const PgModel = require("../model/pgModel");
const express = require("express");
const pgModel = require("../model/pgModel");
const UserModel = require("../model/usersModel");
const { CustomError } = require("../utils/customError");
const router = express.Router();

const allUsersPerPG = async () => {
  return await UserModel.find().populate({
    path: "room",
    select: "pgId",
  });
}

router.get("/", async (req, res) => {
  try {
    let pgData = await PgModel.find().lean().exec();
    const allUsers = await allUsersPerPG()
    pgData.forEach(pgs => {
      if (!!allUsers?.length) {
        
        const totalRevenue = allUsers.filter((user) => user.room && user.room.pgId.equals(pgs._id))
          .reduce((acc, user) => user.amount + acc, 0);
        pgs.totalRevenue = totalRevenue;
      }
    })
    res.status(200).send(pgData);
    return;
  } catch (e) {
    res.status(500).send(e.message);
    return;
  }
});

router.post("/", async (req, res) => {
  try {
    if (!req.body.name || !req.body.noOfFloors) {
      res.status(400).send("Please send name and No of floors");
      return;
    }
    let pgData = await PgModel.create(req.body);
    res.status(201).send("pg added successfully");
    return;
  } catch (e) {
    res.status(500).send(e.message);
    return;
  }
});

//update pg
router.patch("/:id", async (req, res) => {
  try {
    const pgId = req.params.id;
    if (!pgId) {
      res.status(400).send("invalid id");
      return;
    }
    const findPg = await PgModel.findOne({ _id: pgId });
    if (!findPg) {
      res.status(404).send("Pg not found");
      return;
    }
    await findPg.updateOne(req.body);
    res.status(200).send("pg has been updated");
    return;
  } catch (e) {
    res.status(500).send(e.message);
    return;
  }
});

//delete pg
router.delete("/:id", async (req, res) => {
  try {
    const pgId = req.params.id;
    if (!pgId) {
      res.status(400).send("invalid id");
      return;
    }
    const findPg = await PgModel.findOne({ _id: pgId });
    if (!findPg) {
      res.status(404).send("Pg not found");
      return;
    }
    await PgModel.deleteOne({ _id: pgId });
    res.status(200).send("pg has been deleted");
    return;
  } catch (e) {
    res.status(500).send(e.message);
    return;
  }
});



router.get("/:id/revenue", async (req, res) => {
});

module.exports = router;
