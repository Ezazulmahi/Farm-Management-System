import React, { useEffect, useState } from "react";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../api/taskAPI";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
  });
  const [filter, setFilter] = useState("All");

  const loadTasks = async () => {
    const data = await fetchTasks();
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTask(form);
    setForm({ title: "", description: "", assignedTo: "", dueDate: "" });
    loadTasks();
  };

  const handleComplete = async (task) => {
    await updateTask(task._id, { ...task, status: "Completed" });
    loadTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    loadTasks();
  };

  const isOverdue = (task) => {
    return task.status !== "Completed" && new Date(task.dueDate) < new Date();
  };

  const filteredTasks = tasks.filter((t) =>
    filter === "All" ? true : t.status === filter
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Task Management</h2>

      {/* Filter Dropdown */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Filter:</label>
        <select
          className="border rounded px-2 py-1"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white shadow-md rounded-2xl p-4 mb-6"
      >
        <input
          name="title"
          placeholder="Task Title"
          value={form.title}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
        <input
          name="assignedTo"
          placeholder="Assign To"
          value={form.assignedTo}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="p-2 border rounded col-span-1 md:col-span-2"
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded col-span-1 md:col-span-2"
        >
          Add Task
        </button>
      </form>

      {/* Task List */}
      <div className="grid gap-4">
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500">No tasks to display.</p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className={`bg-white shadow rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center border-2 ${
                isOverdue(task) ? "border-red-500" : "border-transparent"
              }`}
            >
              <div>
                <h4 className="font-semibold text-lg">{task.title}</h4>
                <p className="text-sm text-gray-600">{task.description}</p>
                <p className="text-sm">
                  👤 {task.assignedTo} | 📅{" "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
                <span
                  className={`inline-block px-3 py-1 text-sm rounded-full font-medium mt-1 ${
                    task.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {task.status}
                </span>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                {task.status !== "Completed" && (
                  <button
                    onClick={() => handleComplete(task)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Complete
                  </button>
                )}
                <button
                  onClick={() => handleDelete(task._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
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

export default TaskPage;
