import React, { useState, useEffect } from "react";
import {
  getExpenses,
  createExpense,
  deleteExpense,
  updateExpense,
} from "../api/expenseAPI";


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
      const data = await getExpenses(filter); // assumes API supports filter
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

  // 👉 Manual CSV Conversion
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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Expense Tracker</h2>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <select
          name="category"
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          className="p-2 border rounded"
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
          className="p-2 border rounded"
        />

        <input
          type="date"
          name="endDate"
          value={filter.endDate}
          onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
          className="p-2 border rounded"
        />

        <button
          onClick={loadExpenses}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Apply Filters
        </button>

        <button
          onClick={clearFilters}
          className="bg-red-400 text-white px-4 py-2 rounded"
        >
          Clear Filters
        </button>
      </div>

      {/* Export Button */}
      <div className="mb-4">
        <button
          onClick={handleExportCSV}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Export to CSV
        </button>
      </div>

      {/* Form to Add/Edit Expense */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white shadow-md rounded-2xl p-4 mb-6"
      >
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="p-2 border rounded"
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
          className="p-2 border rounded"
          required
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />

        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
          className="p-2 border rounded col-span-1 md:col-span-2"
        ></textarea>

        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded col-span-1 md:col-span-2"
        >
          {isEditing ? "Update Expense" : "Add Expense"}
        </button>
      </form>

      {/* Expense List */}
      <div className="grid gap-4">
        {expenses.length === 0 ? (
          <p className="text-gray-500">No expenses recorded.</p>
        ) : (
          expenses.map((expense) => (
            <div
              key={expense._id}
              className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h4 className="font-semibold text-lg">{expense.category}</h4>
                <p className="text-sm text-gray-600">₹{expense.amount}</p>
                <p className="text-sm text-gray-500">{expense.notes}</p>
                <p className="text-sm text-gray-400">
                  {new Date(expense.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(expense)}
                  className="bg-yellow-500 text-white px-4 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(expense._id)}
                  className="bg-red-500 text-white px-4 py-1 rounded"
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
