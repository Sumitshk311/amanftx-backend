import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, required: true },
  tools: { type: [String], default: [] }, // Naya Field: Tools Array
  thumbnailUrl: { type: String, required: true },
  videoUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Project = mongoose.model("Project", projectSchema);
export default Project;