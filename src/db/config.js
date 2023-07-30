const mongoose = require("mongoose");
require("dotenv").config();

const connect = () =>{
    return mongoose.connect(process.env.CONNECTION_STRING)
}

module.exports = connect;