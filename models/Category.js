import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  displayTitle: { 
    type: String, 
    required: true,
    trim: true 
  },
}, { timestamps: true });

// Pehle agar koi model bana ho toh use update karne ke liye
const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;