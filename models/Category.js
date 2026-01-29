import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  displayTitle: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
}, { timestamps: true });

const Category = mongoose.model("Category", categorySchema);
export default Category;