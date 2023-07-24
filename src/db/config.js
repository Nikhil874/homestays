const mongoose = require("mongoose");

const connect = () =>{
    return mongoose.connect("mongodb+srv://Nikhil874:Nikil874@cluster0.3l0um.mongodb.net/homestays")
}

module.exports = connect;