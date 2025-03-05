import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

// ✅ Function to Connect to MongoDB
const connectDB = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1); // Exit process if connection fails
  }
};

// ✅ Connect to MongoDB before starting the server
connectDB();

// ✅ Initialize Express App
const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors());

// ✅ Test API Route
app.get("/", (req, res) => {
  res.send("🚀 Farm Management System API is Running...");
});

// ✅ Start Server after successful DB connection
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

