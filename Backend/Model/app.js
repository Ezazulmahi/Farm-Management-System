import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import adminOnlineListRoutes from "./Routes/adminOnlineListRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import profileRoutes from "./Routes/ProfileRoutes.js";
import locationRoutes from "./Routes/locationRoutes.js";
import weatherRoutes from "./Routes/weatherRoutes.js";
import farmRoutes from "./Routes/farmRoutes.js";
import bracSeedRoutes from "./Routes/bracseed.js";
import sadeeqAgroRoutes from "./Routes/sadeeqAgroRoutes.js";
import taskRoutes from "./Routes/taskRoutes.js";
import dashboardRoutes from "./Routes/dashboardRoutes.js";
import productRoutes from "./Routes/productRoutes.js";
import expenseRoutes from "./Routes/expenseRoutes.js";
import reviewRoutes from "./Routes/reviewRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  const uploadDir = path.resolve(__dirname, "../uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  app.use("/uploads", express.static(uploadDir));

  const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json({ limit: "1mb" }));

  app.use("/api/users", userRoutes);
  app.use("/api/profile", profileRoutes);
  app.use("/api/location", locationRoutes);
  app.use("/api/weather", weatherRoutes);
  app.use("/api/farms", farmRoutes);
  app.use("/api/orders", adminOnlineListRoutes);
  app.use("/api/tasks", taskRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/bracseed", bracSeedRoutes);
  app.use("/api/sadeeqagro", sadeeqAgroRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/expenses", expenseRoutes);
  app.use("/api/reviews", reviewRoutes);

  app.get("/api/test", (req, res) => {
    res.json({ message: "Backend Connected Successfully!" });
  });
  app.get("/api/welcome", (req, res) => {
    res.json({
      message: "Welcome to the Farm Management System! Let's manage your farm effectively.",
    });
  });

  app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
  });

  app.use((err, req, res, next) => {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid id" });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    if (err.type === "entity.parse.failed") {
      return res.status(400).json({ message: "Malformed JSON body" });
    }
    console.error("Server Error:", err.stack);
    res.status(500).json({ message: "Internal Server Error" });
  });

  return app;
}
