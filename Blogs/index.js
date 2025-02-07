require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db.js");
const cors = require("cors");
const app = express();
const userRouter = require("./controllers/userController.js");
const blogRouter = require("./controllers/blogContorller.js");

app.use(cors({
  origin: "*", // Replace with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use("/users", userRouter);
app.use("/blogs", blogRouter);
// .env FILEDATA
// health

app.get("/health", (req, res) => {
  res.send("Hi Iam good");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async() => {
  await connectDB()
  console.log(`Server running on port ${PORT}`);
});
