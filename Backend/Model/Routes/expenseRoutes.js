// backend/routes/expenseRoutes.js
import express from "express";
const router = express.Router();
import { getExpenses, createExpense, deleteExpense } from "../controllers/expenseController.js";

// GET all expenses
router.get("/", getExpenses);

// POST a new expense
router.post("/", createExpense);

// DELETE an expense
router.delete("/:id", deleteExpense);

export default router;  // ES Module export
