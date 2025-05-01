import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

import adminOnlineListRoutes from "./routes/adminOnlineListRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import farmRoutes from "./routes/farmRoutes.js";
import bracSeedRoutes from "./routes/bracSeed.js";

// ✅ Import notification routes
import notificationsRoute from "./routes/notificationsRoute.js";

const uploadDir = path.resolve(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/uploads", express.static(uploadDir));

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

// Routes
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/farms", farmRoutes);

// Test Routes
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend Connected Successfully!" });
});

app.get("/api/welcome", (req, res) => {
  res.json({
    message: "Welcome to the Farm Management System! Let's manage your farm effectively.",
  });
});
app.use("/api/bracseed", bracSeedRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
