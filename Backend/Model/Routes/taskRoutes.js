// backend/routes/taskRoutes.js
import express from "express";
const router = express.Router();
import { getAllTasks, createTask, updateTask, deleteTask } from "../controllers/TaskController.js";  // ES Module import

// Define routes
router.get("/", getAllTasks);          // GET /api/tasks
router.post("/", createTask);          // POST /api/tasks
router.put("/:id", updateTask);        // PUT /api/tasks/:id
router.delete("/:id", deleteTask);     // DELETE /api/tasks/:id

export default router;  // Export router as default
