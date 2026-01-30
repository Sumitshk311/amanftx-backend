import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

// GET ALL CATEGORIES
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    console.error("Fetch Error:", err.message);
    res.status(500).json({ message: "Categories fetch error" });
  }
});

// ADD CATEGORY
router.post("/", async (req, res) => {
  try {
    const { name, displayTitle } = req.body;

    if (!name || !displayTitle) {
      return res.status(400).json({ message: "Name & Display Title required" });
    }

    const category = new Category({ name, displayTitle });
    const saved = await category.save();

    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Category already exists!" });
    }
    console.error("Add Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE CATEGORY
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
