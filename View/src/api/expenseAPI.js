// api/expenseAPI.js
import axios from "axios";

const API_URL = "/api/expenses";  // Adjust if you're using a custom endpoint

// Get all expenses
export const getExpenses = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }
};

// Create a new expense
export const createExpense = async (expenseData) => {
  try {
    const response = await axios.post(API_URL, expenseData);
    return response.data;
  } catch (error) {
    console.error("Error creating expense:", error);
    throw error;
  }
};

// Delete an expense
export const deleteExpense = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
};

// Update an existing expense
export const updateExpense = async (id, expenseData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, expenseData);
    return response.data;
  } catch (error) {
    console.error("Error updating expense:", error);
    throw error;
  }
};

// Load expenses with filter
const loadExpenses = async () => {
  setLoading(true);
  try {
    const data = await getExpenses(filter);
    console.log("API Response:", data); // Debugging
    setExpenses(Array.isArray(data) ? data : []); // Ensure it's an array
  } catch (error) {
    setError("Failed to load expenses. Please try again.");
    console.error("Error loading expenses:", error);
  } finally {
    setLoading(false);
  }
};
