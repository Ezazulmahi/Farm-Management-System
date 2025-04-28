// controllers/expenseController.js
const Expense = require("../models/Expense");

// @desc    Get all expenses
// @route   GET /api/expenses
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch expenses." });
  }
};

// @desc    Create a new expense
// @route   POST /api/expenses
export const createExpense = async (req, res) => {
  try {
    const { category, amount, notes, date } = req.body;
    const newExpense = new Expense({ category, amount, notes, date });
    const saved = await newExpense.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Failed to create expense." });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
export const deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete expense." });
  }
};
