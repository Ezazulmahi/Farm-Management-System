// routes/expenseRoutes.js
const express = require("express");
const router = express.Router();
const {
  getExpenses,
  createExpense,
  deleteExpense,
} = require("../controllers/expenseController");

// GET all expenses
router.get("/", getExpenses);

// POST a new expense
router.post("/", createExpense);

// DELETE an expense
router.delete("/:id", deleteExpense);

module.exports = router;
