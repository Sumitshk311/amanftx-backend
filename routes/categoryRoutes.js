import express from "express";
import dotenv from "dotenv";
import Category from "../models/Category.js";

dotenv.config();
const router = express.Router();

/* ===== ROUTES ===== */

// 1. GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. ADD category (No Image Needed Now)
router.post("/", async (req, res) => {
  try {
    const { name, displayTitle } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = new Category({
      name,
      displayTitle: displayTitle || name,
    });

    const saved = await category.save();
    res.status(201).json(saved);
  } catch (err) {
    // Agar same naam ki category dubara add karein
    if (err.code === 11000) {
      return res.status(400).json({ message: "Ye category pehle se exist karti hai!" });
    }
    res.status(500).json({ message: err.message });
  }
});

// 3. DELETE category
router.delete("/:id", async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category nahi mili" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;