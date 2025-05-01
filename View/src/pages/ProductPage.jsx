import React, { useState, useEffect } from "react";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/productAPI";
import "../styles/ProductPage.css";
import Sidebar from "../components/Sidebar";

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
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.quantity) {
      setError("Please fill in all required fields (Name, Price, Quantity).");
      return;
    }
    try {
      setLoading(true);
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
      await loadProducts();
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to save product. Please try again.");
    } finally {
      setLoading(false);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setLoading(true);
        await deleteProduct(id);
        await loadProducts();
      } catch (err) {
        setError("Failed to delete product. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredProducts = products.filter(
    (prod) =>
      prod.name.toLowerCase().includes(search.toLowerCase()) ||
      prod.category?.toLowerCase().includes(search.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortKey === "price" || sortKey === "quantity") {
      return a[sortKey] - b[sortKey];
    }
    return a[sortKey]?.localeCompare(b[sortKey]);
  });

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 main-content">
        <h1 className="text-2xl">Product Management</h1>

        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button onClick={() => setError(null)}>&times;</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="col-span-2"
          />
          <div className="col-span-2">
            <button type="submit" className="bg-green-600" disabled={loading}>
              {editId ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="quantity">Sort by Quantity</option>
          </select>
        </div>

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <>
            {paginatedProducts.map((product) => (
              <div
                key={product._id}
                className={`card ${product.quantity < 5 ? "highlight" : ""}`}
              >
                <div>
                  <h3>{product.name}</h3>
                  <p>Category: {product.category}</p>
                  <p>Price: ${product.price}</p>
                  <p>Quantity: {product.quantity}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            <div className="pagination">
              {Array.from({
                length: Math.ceil(sortedProducts.length / itemsPerPage),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={currentPage === index + 1 ? "bg-green-600" : ""}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
