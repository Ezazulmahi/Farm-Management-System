// Backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import userRoutes from "./Routes/userRoutes.js";
import profileRoutes from "./Routes/ProfileRoutes.js";
import locationRoutes from "./Routes/locationRoutes.js";

dotenv.config(); // ✅ Call this at the top before using env vars

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);        // Login/Signup
app.use("/api/profile", profileRoutes);   // User Profile
app.use("/api/location", locationRoutes); // Rider/Farm location

// Sample Routes
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend Connected Successfully!" });
});

app.get("/api/welcome", (req, res) => {
  res.json({
    message: "Welcome to the Farm Management System! Let's manage your farm effectively.",
  });
});

// Connect MongoDB
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

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
