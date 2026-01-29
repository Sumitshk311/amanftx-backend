import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import Project from "../models/Project.js";

dotenv.config();
const router = express.Router();

/* ===== Cloudinary Config ===== */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ===== Storage ===== */
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "aman_portfolio/projects",
    resource_type: file.mimetype.startsWith("video") ? "video" : "image",
  }),
});

const upload = multer({ storage });

/* ===== ROUTES ===== */

// 1. GET all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. GET project by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Invalid ID Format" });
  }
});

// 3. ADD project
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, description, category } = req.body;

      if (!req.files?.image || !req.files?.video) {
        return res.status(400).json({ message: "Thumbnail & Video required" });
      }

      const project = new Project({
        title,
        description,
        category, 
        thumbnailUrl: req.files.image[0].path,
        videoUrl: req.files.video[0].path,
      });

      const saved = await project.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// 4. UPDATE project (Yahi missing tha!)
router.put("/:id", upload.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
]), async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const updateData = { title, description, category };

    // Agar nayi image upload ki hai toh URL update karo
    if (req.files?.image) {
      updateData.thumbnailUrl = req.files.image[0].path;
    }

    // Agar naya video upload kiya hai toh URL update karo
    if (req.files?.video) {
      updateData.videoUrl = req.files.video[0].path;
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true } // Taaki response mein naya data mile
    );

    if (!updatedProject) return res.status(404).json({ message: "Project not found" });
    
    res.json(updatedProject);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// 5. DELETE project
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. UPDATE project (Device se upload support ke saath)
router.put("/:id", upload.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
]), async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    // Pehle purana data nikal lo
    let updateData = { title, description, category };

    // Agar device se nayi image upload ki gayi hai
    if (req.files && req.files.image) {
      updateData.thumbnailUrl = req.files.image[0].path;
    }

    // Agar device se naya video upload kiya gaya hai
    if (req.files && req.files.video) {
      updateData.videoUrl = req.files.video[0].path;
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedProject) return res.status(404).json({ message: "Project nahi mila!" });
    
    res.json(updatedProject);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Server error during update" });
  }
});

export default router;