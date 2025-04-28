import React, { useState, useEffect } from "react";
import {
  getExpenses,
  createExpense,
  deleteExpense,
  updateExpense,
} from "../api/expenseAPI";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/ExpensePage.css";

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
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateExpense(editId, form);
      } else {
        await createExpense(form);
      }
      resetForm();
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

  const resetForm = () => {
    setForm({ category: "", amount: "", notes: "", date: "" });
    setIsEditing(false);
    setEditId(null);
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
    <div className="admin-dashboard-container">
      <AdminNavbar />

      <div className="expense-page">
        <h2 className="page-title">Expense Tracker</h2>

        {/* Filters */}
        <section className="filter-section">
          <select
            name="category"
            value={filter.category}
            onChange={handleFilterChange}
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
            onChange={handleFilterChange}
          />
          <input
            type="date"
            name="endDate"
            value={filter.endDate}
            onChange={handleFilterChange}
          />

          <button className="apply-btn" onClick={loadExpenses}>Apply</button>
          <button className="clear-btn" onClick={clearFilters}>Clear</button>
        </section>

        <div className="export-section">
          <button className="export-btn" onClick={handleExportCSV}>
            Export to CSV
          </button>
        </div>

        {/* Form */}
        <form className="expense-form" onSubmit={handleSubmit}>
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
          />

          <button type="submit">
            {isEditing ? "Update Expense" : "Add Expense"}
          </button>
        </form>

        {/* Expense List */}
        <div className="expense-list">
          {expenses.length === 0 ? (
            <p className="empty-state">No expenses found.</p>
          ) : (
            expenses.map((expense) => (
              <div key={expense._id} className="expense-card">
                <div className="expense-info">
                  <h4>{expense.category}</h4>
                  <p>₹{expense.amount}</p>
                  <p>{expense.notes}</p>
                  <p className="date">
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(expense)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(expense._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpensePage;
