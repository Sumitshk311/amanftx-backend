import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import Category from "../models/Category.js";

dotenv.config();
const router = express.Router();

/* ===== Cloudinary ===== */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ===== Storage ===== */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "aman_portfolio/categories",
    resource_type: "image",
  },
});

const upload = multer({ storage });

/* ===== ROUTES ===== */

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD category
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Image required" });

    const { name, displayTitle } = req.body;

    const category = new Category({
      name,
      displayTitle: displayTitle || name,
      thumbnailUrl: req.file.path,
    });

    const saved = await category.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE category
router.delete("/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
