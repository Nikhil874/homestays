const express = require("express");
const connect = require("./db/config");
const PgController = require("./controller/pgController");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use("/pg", PgController);

app.listen(port, async (req, res) => {
  try {
    await connect();
    console.log(`Server Running On Port ${port}`);
  } catch (er) {
    console.log(er.message);
  }
});
