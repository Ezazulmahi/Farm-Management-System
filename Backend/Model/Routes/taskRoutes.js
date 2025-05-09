// routes/taskRoutes.js
import express from 'express';
// ✅ Correct (go up 2 levels from Model/routes/ to backend/controllers/)
import { getTasks, createTask, updateTask, deleteTask } from "../../controllers/taskController.js";


const router = express.Router();

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
