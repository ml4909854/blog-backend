require("dotenv").config();
const express = require("express");
const router = express.Router();
const UserModel = require("../model/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const IsAuthenticated = require("../middleware/isAuthenticated");
const checkAcess = require("../middleware/checkAcess");
const roles = require("../contants/roles");

// admin data
// get all the users
router.get("/", IsAuthenticated, checkAcess(roles.admin), async (req, res) => {
  try {
    const user = await UserModel.find();
    console.log(user);
    res.status(201).json({ user: user });
  } catch (error) {
    res.status(404).send(error);
  }
});

// register
// register

router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    console.log(req.body);

    // Check if user already exists
    let existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res
        .status(409)  // Conflict status code
        .json({ message: "User already exists, try a different username" });
    }

    // If not, proceed to hash password and create a new user
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUND)
    );
    
    let newUser = new UserModel({ username, password: hashedPassword, role });
    const savedUser = await newUser.save();

    res.status(201).json({ message: "User registered successfully!", user: savedUser });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
});

// login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Incorrect password!" });
    }

   
    if (!process.env.SECRET_KEY) {
      return res
        .status(500)
        .json({ message: "Missing SECRET_KEY in environment variables" });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role},
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token, message: "Login successful!" , userId: user._id  , username:user.username});
  } catch (error) {
    console.error("Login Error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
