import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Routes imports
import projectRoutes from "./routes/projectRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// 1. ADVANCED CORS SETUP
// Isse local development aur Netlify live dono chalenge
const allowedOrigins = [
  "http://localhost:5173",          // Vite Local
  "http://localhost:3000",          // React Local
  "https://aman-ftx.netlify.app/",    // Aapki Live Netlify Site
  "https://aman-ftx.netlify.app"     // Check spelling (just in case)
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("CORS Policy: This origin is not allowed!"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// 2. MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Files/Form data ke liye zaruri hai

// 3. ROUTES
app.use("/api/projects", projectRoutes);
app.use("/api/categories", categoryRoutes);

// 4. HEALTH CHECK / ROOT ROUTE
app.get("/", (req, res) => {
  res.json({ 
    status: "Active", 
    message: "AmanFTX Backend is running smoothly 🚀",
    uptime: process.uptime() 
  });
});

// 5. GLOBAL ERROR HANDLER (Backend crash hone se bachata hai)
app.use((err, req, res, next) => {
  console.error("Internal Error:", err.stack);
  res.status(500).json({ 
    success: false, 
    message: "Server mein kuch fatt gaya!", 
    error: err.message 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ################################################
  🚀  Server is screaming on port: ${PORT}
  🌍  CORS allowed for: ${allowedOrigins.join(", ")}
  ################################################
  `);
});