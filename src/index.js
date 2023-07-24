const express = require("express");
const connect = require("./db/config");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.listen(port, async (req, res) => {
  try {
    await connect();
    console.log(`Server Running On Port ${port}`);
  } catch (er) {
    console.log(er.message);
  }
});
