require("dotenv").config;
const mongoose = require("mongoose");
const mongoUrl = process.env.MONGO_URL;
const password = process.env.MONGO_PASSWORD

const connectDB = () => {
  try {
    mongoose.connect(`mongodb+srv://${mongoUrl}:${password}@cluster0.x78zq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
    console.log("connected to the Database");
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectDB;
