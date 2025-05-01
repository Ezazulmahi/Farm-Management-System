// src/api/adminAPI.js

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getDashboardData = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard`);
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }
  return response.json();
};
