import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import { fetchTasks, createTask, updateTask, deleteTask } from "../api/taskAPI";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data);
      setError("");
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = async (form) => {
    await createTask(form);
    loadTasks();
  };

  const handleComplete = async (taskId) => {
    const task = tasks.find((t) => t._id === taskId);
    await updateTask(taskId, { ...task, status: "Completed" });
    loadTasks();
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(taskId);
      loadTasks();
    }
  };

  const filteredTasks = useMemo(() =>
    tasks.filter((t) => (filter === "All" ? true : t.status === filter)),
    [tasks, filter]
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Task Management</h2>

        <div className="mb-4 flex items-center gap-2">
          <label className="font-medium">Filter:</label>
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

        <TaskForm onSubmit={handleAddTask} />

        {loading ? (
          <p className="text-gray-500">Loading tasks...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredTasks.length === 0 ? (
          <p className="text-gray-500">No tasks to display. Add one above!</p>
        ) : (
          <div className="grid gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onComplete={() => handleComplete(task._id)}
                onDelete={() => handleDelete(task._id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default TaskPage;
