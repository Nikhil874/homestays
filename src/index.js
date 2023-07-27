const express = require("express");
const connect = require("./db/config");
const PgController = require("./controller/pgController");
const FloorController = require("./controller/floorController");
const RoomController = require("./controller/roomController");
const Controllers = require("./controller");
require("dotenv").config();

const port = process.env.PORT || 1333;

const app = express();

app.use(express.json());
app.use("/api/v1/pg", Controllers);

app.listen(port, async (req, res) => {
  try {
    await connect();
    console.log(`Server Running On Port ${port}`);
  } catch (er) {
    console.log(er.message);
  }
});
