const express = require("express");
const Controller = express();
const PgController = require("./pgController");
const FloorController = require("./floorController");
const RoomController = require("./roomController");
const UserController = require("./userController");

Controller.use("", PgController);
Controller.use("/floors", FloorController);
Controller.use("/rooms", RoomController);
Controller.use("/users", UserController);

module.exports = Controller;