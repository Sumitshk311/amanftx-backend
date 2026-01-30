import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

// GET ALL CATEGORIES
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Categories fetch karne mein error: " + err.message });
  }
});

// ADD CATEGORY
router.post("/", async (req, res) => {
  try {
    const { name, displayTitle } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category ka naam zaroori hai!" });
    }

    const category = new Category({
      name,
      displayTitle: displayTitle || name,
    });

    const saved = await category.save();
    res.status(201).json(saved);
  } catch (err) {
    // Unique name error handling
    if (err.code === 11000) {
      return res.status(400).json({ message: "Ye category pehle se bani hui hai!" });
    }
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

export default router;