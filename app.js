const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./db/connect");
const Blog = require("./models/Blog");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Blog App API" });
});

// GET ALL BLOGS
app.get("/api/v1/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    const sanitized = blogs.map((blog) => {
      const blogObj = blog.toObject();
      delete blogObj.password;
      return blogObj;
    });
    res.status(200).json(sanitized);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE A NEW BLOG
app.post("/api/v1/blogs", async (req, res) => {
  try {
    const { title, content, author, tags, password } = req.body;

    const cleanPassword = password ? password.trim() : null; // Set to null if no password is provided

    const newBlog = new Blog({
      title,
      content,
      author: author || "Anonymous",
      tags: tags || [],
      password: cleanPassword, // Store the password (null if no password)
    });

    const savedBlog = await newBlog.save();
    const blogToReturn = savedBlog.toObject();
    delete blogToReturn.password; // Don't send password to client

    res.status(201).json(blogToReturn);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET SINGLE BLOG
app.get("/api/v1/blogs/:id", async (req, res) => {
  try {
    let id = req.params.id.trim().replace(/\\/g, "");

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    const { password, includePassword } = req.query;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const blogData = blog.toObject();

    if (includePassword === "true") {
      return res.status(200).json(blogData); // Include password for editing
    }

    if (blog.password && blog.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    delete blogData.password; // Hide password from response
    res.status(200).json(blogData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE BLOG (with optional password handling)
app.put("/api/v1/blogs/:id", async (req, res) => {
  try {
    let id = req.params.id.trim().replace(/\\/g, "");

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    const { title, content, author, tags, password, newPassword } = req.body;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check for password validation
    const masterPassword = process.env.MASTER_PASSWORD;
    const isPasswordValid =
      !blog.password ||
      blog.password === password ||
      password === masterPassword;

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    blog.title = title;
    blog.content = content;
    blog.author = author;
    blog.tags = tags;

    if (newPassword !== undefined) {
      const cleanNewPwd = newPassword.trim();
      blog.password = cleanNewPwd !== "" ? cleanNewPwd : undefined; // Update password if provided
    }

    const updatedBlog = await blog.save();
    const blogToReturn = updatedBlog.toObject();
    delete blogToReturn.password; // Don’t send password to client

    res.status(200).json(blogToReturn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE BLOG (with optional password handling)
app.delete("/api/v1/blogs/:id", async (req, res) => {
  try {
    let id = req.params.id.trim().replace(/\\/g, "");

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    const { password } = req.body;
    const masterPassword = process.env.MASTER_PASSWORD;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const isPasswordValid =
      !blog.password ||
      blog.password === password ||
      password === masterPassword;

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    await blog.deleteOne();
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 8080;

const start = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to DATABASE");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
  }
};

start();
