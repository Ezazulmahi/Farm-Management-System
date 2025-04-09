// src/components/ProductForm.jsx
import React, { useState, useEffect } from "react";
import { createProduct, updateProduct } from "../api/productAPI";  // Create these API functions

const ProductForm = ({ product }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setQuantity(product.quantity);
      setCategory(product.category);
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (product) {
      updateProduct(product._id, { name, price, quantity, category });
    } else {
      createProduct({ name, price, quantity, category });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full p-2 border border-gray-300"
        />
      </div>
      <div>
        <label>Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="block w-full p-2 border border-gray-300"
        />
      </div>
      <div>
        <label>Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="block w-full p-2 border border-gray-300"
        />
      </div>
      <div>
        <label>Category</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="block w-full p-2 border border-gray-300"
        />
      </div>
      <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">
        {product ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
};

export default ProductForm;
