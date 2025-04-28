import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./Routes/userRoutes.js";
import profileRoutes from "./Routes/ProfileRoutes.js";
import locationRoutes from "./Routes/locationRoutes.js";
import weatherRoutes from "./Routes/weatherRoutes.js";


dotenv.config();

const app = express();


app.use(cors({ origin: "http://localhost:5173" })); 
app.use(express.json());


const connectDB = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

connectDB();


app.use("/api/users", userRoutes);          
app.use("/api/profile", profileRoutes);     
app.use("/api/location", locationRoutes);  

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend Connected Successfully!" });
});
app.use("/api/weather", weatherRoutes); 

app.get("/api/welcome", (req, res) => {
  res.json({
    message: "Welcome to the Farm Management System! Let's manage your farm effectively.",
  });
});


app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
