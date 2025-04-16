// src/api/productAPI.js
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/products"; // Or use env variable for production

export const fetchProducts = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

export const createProduct = async (data) => {
  const res = await axios.post(BASE_URL, data);
  return res.data;
};

export const updateProduct = async (id, data) => {
  const res = await axios.put(`${BASE_URL}/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
};
