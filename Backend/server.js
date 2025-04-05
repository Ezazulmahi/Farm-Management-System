import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./Routes/userRoutes.js";

dotenv.config();


const connectDB = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};
connectDB();

const app = express();

// ✅ Middleware
app.use(cors({ origin: "http://localhost:5173" })); // Allow Vite frontend
app.use(express.json());

// ✅ Routes
app.use("/api/users", userRoutes); // Add user routes

// ✅ Test API Route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend Connected Successfully!" });
});

// ✅ Welcome API Route
app.get("/api/welcome", (req, res) => {
  res.json({
    message: "Welcome to the Farm Management System! Let's manage your farm effectively.",
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
