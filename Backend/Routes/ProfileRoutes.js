// Backend/routes/profileRoutes.js

import express from "express";
import { getUserProfile } from "../controller/profileController.js"; // ✅ match the casing

const router = express.Router();

// GET /api/profile/:id
router.get("/:id", getUserProfile);

export default router;
