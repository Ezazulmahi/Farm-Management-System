const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask
} = require("../controllers/TaskController");

router.get("/", getAllTasks);          // GET /api/tasks
router.post("/", createTask);          // POST /api/tasks
router.put("/:id", updateTask);        // PUT /api/tasks/:id
router.delete("/:id", deleteTask);     // DELETE /api/tasks/:id

module.exports = router;
