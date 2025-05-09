// pages/InventoryPage.jsx
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import fetchProducts from "../api/fetchProducts"; // Assuming this is your API call function
import Sidebar from "../components/Sidebar"; // Import the Sidebar component
import "../styles/InventoryPage.css";

const InventoryPage = () => {
  const [products, setProducts] = useState([]); // Ensure products is initialized as an array
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = searchTerm.trim().toLowerCase();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProducts();
        if (Array.isArray(data)) {
          setProducts(data); // Set products only if it's an array
        } else {
          console.error("Expected an array but got:", data);
          setProducts([]); // Fallback to an empty array
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Error loading inventory. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredProducts = Array.isArray(products)
    ? products.filter((product) =>
        product.name.toLowerCase().includes(debouncedSearchTerm)
      )
    : [];

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center">
        <div className="loader"></div>
        <span className="loader-message">Loading inventory...</span>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar /> {/* Render the Sidebar component */}
      <div className="p-4 flex-1">
        <ToastContainer />
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Inventory Management</h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products..."
            className="border p-2 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="w-full border text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Product</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="p-2 border">{product.name}</td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="1" className="text-center p-4 text-gray-500">
                  No inventory data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryPage;
