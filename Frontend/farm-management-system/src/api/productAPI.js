// src/api/productAPI.js

export const getAllProducts = async () => {
    const res = await fetch("/api/products");
    return res.json();
  };
  
  export const createProduct = async (data) => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  };
  
  export const updateProduct = async (id, data) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  };
  
  export const deleteProduct = async (id) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });
    return res.json();
  };
  