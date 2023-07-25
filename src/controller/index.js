const express = require("express")
const Controller = express();
const PgController = require("./pgController")
const FloorController = require("./floorController")
const RoomController = require("./roomController")

Controller.use("", PgController);
Controller.use("floor", FloorController);
Controller.use("room", RoomController);

module.exports = Controller;