import React, { useEffect, useState } from "react";
import { fetchProducts, deleteProduct } from "../api/productAPI";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const loadProducts = async () => {
    const data = await fetchProducts();
    setProducts(data);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure?")) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Products</h2>
        <button
          onClick={() => navigate("/admin/products/create")}
          className="bg-green-600 text-white px-4 py-2 rounded-md"
        >
          + Add Product
        </button>
      </div>

      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Qty</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">₹{p.price}</td>
              <td className="p-2 border">{p.quantity}</td>
              <td className="p-2 border">{p.category}</td>
              <td className="p-2 border">
                <button
                  onClick={() => navigate(`/admin/products/edit/${p._id}`)}
                  className="text-blue-600 mr-2"
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(p._id)} className="text-red-600">
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-500">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
