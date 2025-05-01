import React, { useState, useEffect } from "react";
import {
  getExpenses,
  createExpense,
  deleteExpense,
  updateExpense,
} from "../api/expenseAPI";
import { CATEGORY_OPTIONS } from "../constants/categories";
import Sidebar from "../components/Sidebar";
import ExpenseCard from "../components/ExpenseCard";
import "../styles/ExpensePage.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="pagination">
    <button
      disabled={currentPage === 1}
      onClick={() => onPageChange(currentPage - 1)}
    >
      Previous
    </button>
    <span>
      Page {currentPage} of {totalPages}
    </span>
    <button
      disabled={currentPage === totalPages}
      onClick={() => onPageChange(currentPage + 1)}
    >
      Next
    </button>
  </div>
);

const FilterSection = ({ filter, onFilterChange, onApply, onClear }) => (
  <section className="filter-section">
    <select
      name="category"
      value={filter.category}
      onChange={onFilterChange}
      aria-label="Filter by category"
    >
      <option value="">All Categories</option>
      {CATEGORY_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <input
      type="date"
      name="startDate"
      value={filter.startDate}
      onChange={onFilterChange}
      aria-label="Filter by start date"
    />
    <input
      type="date"
      name="endDate"
      value={filter.endDate}
      onChange={onFilterChange}
      aria-label="Filter by end date"
    />
    <button className="apply-btn" onClick={onApply}>
      Apply
    </button>
    <button className="clear-btn" onClick={onClear}>
      Clear
    </button>
  </section>
);

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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const data = await getExpenses(filter);
      setExpenses(Array.isArray(data) ? data : []);
    } catch (error) {
      setError("Failed to load expenses. Please try again.");
    } finally {
      setLoading(false);
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
        setSuccess("Expense updated successfully.");
      } else {
        await createExpense(form);
        setSuccess("Expense added successfully.");
      }
      resetForm();
      loadExpenses();
    } catch (error) {
      setError("Failed to save expense. Please try again.");
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
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await deleteExpense(id);
      setSuccess("Expense deleted successfully.");
      loadExpenses();
    } catch (error) {
      setError("Failed to delete expense. Please try again.");
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

  const handleExportCSV = () => {
    if (expenses.length === 0) return;
    if (!window.confirm("Do you want to export the expenses to CSV?")) return;

    const csv = convertToCSV(expenses);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "expenses.csv";
    link.click();
  };

  return (
    <div className="min-h-screen">
      <Sidebar handleLogout={() => localStorage.removeItem("userInfo")} />
      <div className="main-content bg-gray-100">
        <div className="flex flex-col flex-1 p-6">
          <div className="expense-page">
            <h2 className="page-title">Expense Tracker</h2>

            {error && <div className="error-message">{error}</div>}
            {!error && success && <div className="success-message">{success}</div>}

            <FilterSection
              filter={filter}
              onFilterChange={handleFilterChange}
              onApply={loadExpenses}
              onClear={clearFilters}
            />

            <div className="export-section">
              <button className="export-btn" onClick={handleExportCSV}>
                Export to CSV
              </button>
            </div>

            <form className="expense-form" onSubmit={handleSubmit}>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                aria-label="Select category"
              >
                <option value="" disabled>
                  Select Category
                </option>
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="amount"
                placeholder="Enter amount (e.g., 100)"
                value={form.amount}
                onChange={handleChange}
                required
                min="0"
                aria-label="Enter amount"
              />
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                aria-label="Select date"
              />
              <textarea
                name="notes"
                placeholder="Add notes (optional)"
                value={form.notes}
                onChange={handleChange}
                aria-label="Add notes"
              />
              <button type="submit" disabled={loading}>
                {loading ? "Saving..." : isEditing ? "Update Expense" : "Add Expense"}
              </button>
            </form>

            {loading ? (
              <div className="loading-spinner" aria-label="Loading"></div>
            ) : (
              <div className="expense-list">
                {expenses.length > 0 ? (
                  expenses.map((expense) => (
                    <ExpenseCard
                      key={expense._id}
                      expense={expense}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <p className="empty-state">No expenses found.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensePage;
