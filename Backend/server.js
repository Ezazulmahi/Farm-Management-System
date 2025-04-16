// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

// Route Imports
import userRoutes from "./Routes/userRoutes.js";
import profileRoutes from "./Routes/ProfileRoutes.js";
import productRoutes from "./Routes/productRoutes.js";
import taskRoutes from "./Routes/taskRoutes.js";
import expenseRoutes from "./Routes/expenseRoutes.js";

// Config
dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/products", productRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/expenses", expenseRoutes);

// Test Routes
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend Connected Successfully!" });
});

app.get("/api/welcome", (req, res) => {
  res.json({
    message:
      "Welcome to the Farm Management System! Let's manage your farm effectively.",
  });
});

// MongoDB Connection
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
