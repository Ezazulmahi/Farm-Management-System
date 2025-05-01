// TaskForm.jsx
import React, { useState } from "react";

const TaskForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.title.trim().length < 3) {
      alert("Title must be at least 3 characters.");
      return;
    }
    onSubmit(form);
    setForm({ title: "", description: "", assignedTo: "", dueDate: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 bg-white shadow-lg rounded-2xl p-6 mb-8">
      <input
        name="title"
        placeholder="Task Title"
        value={form.title}
        onChange={handleChange}
        className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
        required
      />
      <input
        name="assignedTo"
        placeholder="Assign To"
        value={form.assignedTo}
        onChange={handleChange}
        className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
        required
      />
      <input
        type="date"
        name="dueDate"
        value={form.dueDate}
        onChange={handleChange}
        className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
        required
      />
      <input
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="p-3 border border-gray-300 rounded-xl md:col-span-2 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl transition md:col-span-2">
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;