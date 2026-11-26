import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createApp } from "../Model/app.js";

// Reads WEATHER_API_KEY and CLIENT_ORIGIN from Model/.env if it exists; MONGO_URI is ignored here.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", "Model", ".env"), quiet: true });

const PORT = process.env.PORT || 5000;

const mongod = await MongoMemoryServer.create();
await mongoose.connect(mongod.getUri());
console.log("In-memory MongoDB started. Data is lost when this process stops.");

createApp().listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const shutdown = async () => {
  await mongoose.disconnect();
  await mongod.stop();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
