const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./db/connect");
const Quote = require("./models/Quote");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root Route
app.get("/", (req, res) => {
<<<<<<< HEAD
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
=======
  res.status(200).json({ message: "Welcome to QuoteVault API" });
});

// GET ALL QUOTES (no passwords exposed)
app.get("/api/v1/quotes", async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    const sanitized = quotes.map((quote) => {
      const q = quote.toObject();
      delete q.password;
      return q;
>>>>>>> b99ad5000cacb61b3fbe0680815ff57ba2291897
    });
    res.status(200).json(sanitized);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

<<<<<<< HEAD
// CREATE A NEW BLOG
app.post("/api/v1/blogs", async (req, res) => {
  try {
    const { title, content, author, tags, password } = req.body;

    const cleanPassword = password ? password.trim() : null; // Set to null if no password is provided

    const newBlog = new Blog({
=======
// CREATE NEW QUOTE
app.post("/api/v1/quotes", async (req, res) => {
  try {
    const { title, content, author, tags, password } = req.body;

    const newQuote = new Quote({
>>>>>>> b99ad5000cacb61b3fbe0680815ff57ba2291897
      title,
      content,
      author: author || "Anonymous",
      tags: tags || [],
<<<<<<< HEAD
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
=======
      password: password?.trim() || undefined,
    });

    const savedQuote = await newQuote.save();
    const quoteToReturn = savedQuote.toObject();
    delete quoteToReturn.password;

    res.status(201).json(quoteToReturn);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET SINGLE QUOTE
app.get("/api/v1/quotes/:id", async (req, res) => {
  try {
    const id = req.params.id.trim().replace(/\\/g, "");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid quote ID" });
    }

    const { password, includePassword } = req.query;
    const masterPassword = process.env.MASTER_PASSWORD;

    console.log("🚨 MASTER_PASSWORD:", masterPassword);
    console.log("🧪 Incoming password from query:", password);

    const quote = await Quote.findById(id);

    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    const quoteData = quote.toObject();

    // Return full quote including password if requested explicitly
    if (includePassword === "true") {
      return res.status(200).json(quoteData);
    }

    // Password validation logic
    const isPasswordValid =
      password === masterPassword ||
      (!quote.password && !password) ||
      quote.password === password;
>>>>>>> b99ad5000cacb61b3fbe0680815ff57ba2291897

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

<<<<<<< HEAD
    await blog.deleteOne();
    res.status(200).json({ message: "Blog deleted successfully" });
=======
    delete quoteData.password;
    res.status(200).json(quoteData);
>>>>>>> b99ad5000cacb61b3fbe0680815ff57ba2291897
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

<<<<<<< HEAD
// Start Server
const PORT = process.env.PORT || 8080;

=======
// UPDATE QUOTE
app.put("/api/v1/quotes/:id", async (req, res) => {
  try {
    const id = req.params.id.trim().replace(/\\/g, "");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid quote ID" });
    }

    const { title, content, author, tags, password, newPassword } = req.body;
    const masterPassword = process.env.MASTER_PASSWORD;
    const quote = await Quote.findById(id);

    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    const isPasswordValid =
      password === masterPassword ||
      (!quote.password && !password) ||
      quote.password === password;

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    quote.title = title;
    quote.content = content;
    quote.author = author;
    quote.tags = tags;

    if (typeof newPassword !== "undefined") {
      const cleanNewPwd = newPassword.trim();
      quote.password = cleanNewPwd !== "" ? cleanNewPwd : undefined;
    }

    const updatedQuote = await quote.save();
    const quoteToReturn = updatedQuote.toObject();
    delete quoteToReturn.password;

    res.status(200).json(quoteToReturn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE QUOTE
app.delete("/api/v1/quotes/:id", async (req, res) => {
  try {
    const id = req.params.id.trim().replace(/\\/g, "");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid quote ID" });
    }

    const password = req.query.password || req.body.password;
    const masterPassword = process.env.MASTER_PASSWORD;
    const quote = await Quote.findById(id);

    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    const isPasswordValid =
      password === masterPassword ||
      (!quote.password && !password) ||
      quote.password === password;

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    await quote.deleteOne();
    res.status(200).json({ message: "Quote deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 8080;

>>>>>>> b99ad5000cacb61b3fbe0680815ff57ba2291897
const start = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to DATABASE");
<<<<<<< HEAD

=======
>>>>>>> b99ad5000cacb61b3fbe0680815ff57ba2291897
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
  }
};

start();
