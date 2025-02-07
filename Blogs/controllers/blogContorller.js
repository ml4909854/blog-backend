const express = require("express");
const router = express.Router();
const Blog = require("../model/BlogModel.js");
const checkAcess = require("../middleware/checkAcess");
const roles = require("../contants/roles");
const IsAuthenticated = require("../middleware/isAuthenticated");
const UserModel = require("../model/UserModel.js");

// 1. Get all the blogs (everyone)
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "username");
    res.status(200).json(blogs); // Changed 201 to 200
  } catch (error) {
    res.status(500).send(error); // 500 for internal server error
  }
});

// search blog by username

// Get blogs of the currently logged-in author
router.get(
  "/myBlog",
  IsAuthenticated,
  checkAcess(roles.author),
  async (req, res) => {
    try {
      const authorId = req.user._id; 
        // Get the logged-in author's ID
      const blogs = await Blog.find({ author: authorId }).populate(
        "author",
        "username"
      );

      res.status(201).json(blogs); // Changed 201 to 200
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  }
);


// 2. Create a new blog (author)
router.post(
  "/create",
  IsAuthenticated,
  checkAcess(roles.author),
  async (req, res) => {
    try {
      const { title, content } = req.body;
      const blog = new Blog({ title, content, author: req.user._id });
      const savedBlog = await blog.save();
      res.status(201).json(savedBlog);
    } catch (error) {
      res.status(401).send(error);
    }
  }
);

// 3. Edit a blog (author their own blog /admin)
router.patch(
  "/update/:id",
  IsAuthenticated,
  checkAcess(roles.author),
  async (req, res) => {
    try {
      const blogId = req.params.id;
      const blog = await Blog.findById(blogId);

      if (!blog) {
        return res.status(404).json({ message: "Not found!" });
      }

      if (blog.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Access Denied!" });
      }

      const updateBlog = await Blog.findByIdAndUpdate(blogId, req.body, {
        new: true,
      });
      res.json(updateBlog);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// 4. Delete a blog (author their own blog /admin)
router.delete(
  "/delete/:id",
  IsAuthenticated,
  checkAcess(roles.author),
  async (req, res) => {
    try {
      const blogId = req.params.id;
      const blog = await Blog.findById(blogId);

      if (!blog) {
        return res.status(404).json({ message: "Not found!" });
      }

      if (
        blog.author.toString() !== req.user._id.toString() &&
        req.user.role !== roles.admin
      ) {
        return res
          .status(403)
          .json({ message: "Access Denied! Only admin/author delte" });
      }

      const deleteBlog = await Blog.findByIdAndDelete(blogId);
      res.status(200).json(deleteBlog);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

module.exports = router;
