import axios from "axios";

const BASE_URL = "http://localhost:5000/api/tasks"; // Adjust if needed

// GET all tasks
export const fetchTasks = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

// CREATE a new task
export const createTask = async (taskData) => {
  const res = await axios.post(BASE_URL, taskData);
  return res.data;
};

// UPDATE a task
export const updateTask = async (id, taskData) => {
  const res = await axios.put(`${BASE_URL}/${id}`, taskData);
  return res.data;
};

// DELETE a task
export const deleteTask = async (id) => {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
};
