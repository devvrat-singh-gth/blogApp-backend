const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true }, // The main quote text
    content: { type: String, required: true }, // Explanation of the quote
    author: { type: String, required: true, default: "Anonymous" },
    tags: [{ type: String, trim: true }],
    password: { type: String, default: null }, // Optional password (null if not provided)
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("quote", quoteSchema);
