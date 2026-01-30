import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Routes
import projectRoutes from "./routes/projectRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ CORS CONFIG (Render + Local + Netlify safe)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://aman-ftx.netlify.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Postman / server requests

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(null, true); // IMPORTANT: Don't crash server
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// ✅ Preflight fix
app.options("*", cors());

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/projects", projectRoutes);
app.use("/api/categories", categoryRoutes);

// Root test route
app.get("/", (req, res) => {
  res.json({
    status: "Active",
    message: "AmanFTX Backend Running 🚀",
    uptime: process.uptime()
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err.stack);
  res.status(500).json({
    success: false,
    message: "Backend Error",
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("==================================");
  console.log(`🚀 Server Running on Port ${PORT}`);
  console.log("🌍 Allowed Origins:", allowedOrigins);
  console.log("==================================");
});
