// src/pages/ProductPage.jsx
import React, { useState, useEffect } from "react";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/productAPI";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);  // For error handling

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateProduct(editId, form);
      } else {
        await createProduct(form);
      }
      setForm({
        name: "",
        description: "",
        price: "",
        quantity: "",
        category: "",
      });
      setEditId(null);
      loadProducts();
    } catch (err) {
      setError("Failed to save product.");
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
    });
    setEditId(product._id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      setError("Failed to delete product.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Management</h2>

      {/* Error Handling */}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl shadow mb-6"
      >
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
        <input
          name="category"
          placeholder="Category (e.g. Vegetables)"
          value={form.category}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="price"
          type="number"
          placeholder="Price (₹)"
          value={form.price}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded col-span-1 md:col-span-2"
        >
          {editId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Product List */}
      <div className="grid gap-4">
        {products.length === 0 ? (
          <p className="text-gray-500">No products available.</p>
        ) : (
          products.map((prod) => (
            <div
              key={prod._id}
              className="bg-white p-4 shadow rounded-xl flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">{prod.name}</h3>
                <p className="text-sm text-gray-600">{prod.description}</p>
                <p className="text-sm text-gray-500">
                  {prod.quantity} pcs – ₹{prod.price || 0}
                </p>
                <p className="text-xs text-gray-400">Category: {prod.category}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(prod)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(prod._id)}
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

export default ProductPage;
