// pages/InventoryPage.jsx
import React, { useEffect, useState } from "react";
import { fetchProducts, updateProduct } from "../api/productAPI";

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [restockQty, setRestockQty] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleRestock = async (id) => {
    const product = products.find((p) => p._id === id);
    const updated = {
      ...product,
      quantity: product.quantity + parseInt(restockQty),
    };
    await updateProduct(id, updated);
    setRestockQty("");
    setEditingId(null);

    // reload list
    const updatedData = await fetchProducts();
    setProducts(updatedData);
  };

  if (loading) return <div className="p-4">Loading inventory...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Inventory Management</h2>

      <table className="w-full border text-left text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Product</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">{p.quantity}</td>
              <td className="p-2 border">
                {p.quantity < 5 ? (
                  <span className="text-red-600 font-semibold">Low Stock</span>
                ) : (
                  <span className="text-green-600">OK</span>
                )}
              </td>
              <td className="p-2 border">
                {editingId === p._id ? (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      className="border p-1 w-20"
                      placeholder="Qty"
                      value={restockQty}
                      onChange={(e) => setRestockQty(e.target.value)}
                    />
                    <button
                      onClick={() => handleRestock(p._id)}
                      className="bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-400 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingId(p._id)}
                    className="text-blue-600"
                  >
                    Restock
                  </button>
                )}
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
                No inventory data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryPage;
