require("dotenv").config();
const jwt = require("jsonwebtoken");
const UserModel = require("../model/UserModel.js");

const IsAuthenticated = async (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Acess denied No token Provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = await UserModel.findById(decoded._id);
    next();
  } catch (error) {
    res.status(500).json({ error: "Invalid Token" });
  }
};

module.exports = IsAuthenticated;
