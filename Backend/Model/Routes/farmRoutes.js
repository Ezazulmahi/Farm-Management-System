import express from "express";
import { getFarms, createFarm, deleteFarm } from "../../controllers/farmController.js";

const router = express.Router();

// GET all farms
router.get("/", getFarms);

// POST create new farm
router.post("/", createFarm);

// DELETE a farm by ID
router.delete("/:id", deleteFarm);

export default router;
