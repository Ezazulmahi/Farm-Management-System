import React, { useState, useEffect } from "react";
import {
  getExpenses,
  createExpense,
  deleteExpense,
  updateExpense,
} from "../api/expenseAPI";
import "../styles/ExpensePage.css"; // Make sure this path matches your project structure

const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    category: "",
    amount: "",
    notes: "",
    date: "",
  });
  const [filter, setFilter] = useState({
    category: "",
    startDate: "",
    endDate: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const data = await getExpenses(filter);
      setExpenses(data);
    } catch (error) {
      console.error("Error loading expenses:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateExpense(editId, form);
      } else {
        await createExpense(form);
      }
      setForm({ category: "", amount: "", notes: "", date: "" });
      setIsEditing(false);
      setEditId(null);
      loadExpenses();
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  const handleEdit = (expense) => {
    setForm({
      category: expense.category,
      amount: expense.amount,
      notes: expense.notes,
      date: expense.date,
    });
    setIsEditing(true);
    setEditId(expense._id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      loadExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const clearFilters = () => {
    setFilter({ category: "", startDate: "", endDate: "" });
    loadExpenses();
  };

  const convertToCSV = (data) => {
    if (data.length === 0) return "";
    const header = Object.keys(data[0]).join(",");
    const rows = data.map((row) =>
      Object.values(row)
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(",")
    );
    return [header, ...rows].join("\n");
  };

  const handleExportCSV = () => {
    if (expenses.length === 0) return;
    const csv = convertToCSV(expenses);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "expenses.csv";
    link.click();
  };

  return (
    <div className="expense-page">
      <h2>Expense Tracker</h2>

      {/* Filter Controls */}
      <div className="filter-controls">
        <select
          name="category"
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
        >
          <option value="">All Categories</option>
          <option value="Seeds">Seeds</option>
          <option value="Fertilizer">Fertilizer</option>
          <option value="Labor">Labor</option>
          <option value="Equipment">Equipment</option>
          <option value="Transport">Transport</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="date"
          name="startDate"
          value={filter.startDate}
          onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
        />

        <input
          type="date"
          name="endDate"
          value={filter.endDate}
          onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
        />

        <button onClick={loadExpenses} className="apply-btn">
          Apply Filters
        </button>

        <button onClick={clearFilters} className="clear-btn">
          Clear Filters
        </button>
      </div>

      {/* Export Button */}
      <button onClick={handleExportCSV} className="export-btn">
        Export to CSV
      </button>

      {/* Form to Add/Edit Expense */}
      <form onSubmit={handleSubmit} className="expense-form">
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Seeds">Seeds</option>
          <option value="Fertilizer">Fertilizer</option>
          <option value="Labor">Labor</option>
          <option value="Equipment">Equipment</option>
          <option value="Transport">Transport</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
        ></textarea>

        <button type="submit">
          {isEditing ? "Update Expense" : "Add Expense"}
        </button>
      </form>

      {/* Expense List */}
      <div className="expense-list">
        {expenses.length === 0 ? (
          <p className="empty-state">No expenses recorded.</p>
        ) : (
          expenses.map((expense) => (
            <div key={expense._id} className="expense-card">
              <div>
                <h4>{expense.category}</h4>
                <p>₹{expense.amount}</p>
                <p>{expense.notes}</p>
                <p className="date">
                  {new Date(expense.date).toLocaleDateString()}
                </p>
              </div>
              <div className="actions">
                <button
                  onClick={() => handleEdit(expense)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(expense._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpensePage;
