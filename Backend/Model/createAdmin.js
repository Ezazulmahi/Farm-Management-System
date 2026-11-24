import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";
import User from "./models/User.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const { MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Set MONGO_URI, ADMIN_EMAIL and ADMIN_PASSWORD in Backend/Model/.env first.");
  process.exit(1);
}

await mongoose.connect(MONGO_URI);
const email = ADMIN_EMAIL.toLowerCase().trim();
const password = await bcrypt.hash(ADMIN_PASSWORD, 10);
const existing = await User.findOne({ email });
if (existing) {
  existing.type = "admin";
  existing.password = password;
  await existing.save();
  console.log(`Promoted ${email} to admin.`);
} else {
  await User.create({
    name: "Admin",
    email,
    phoneNumber: process.env.ADMIN_PHONE || "00000000000",
    address: "Head office",
    password,
    type: "admin",
  });
  console.log(`Created admin ${email}.`);
}
await mongoose.disconnect();
