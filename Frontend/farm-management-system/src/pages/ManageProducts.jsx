// src/pages/ManageProducts.jsx
import React, { useEffect, useState } from "react";
import { getAllProducts } from "../api/productAPI";  // Create this API function
import ProductList from "../components/ProductList";  // For displaying product list
import ProductForm from "../components/ProductForm";  // For adding/editing products

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProducts();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>

      {/* Product Form for adding/editing */}
      <ProductForm product={editingProduct} />

      {/* Product List */}
      <ProductList
        products={products}
        onEdit={handleEditProduct}
        onDelete={deleteProduct}
      />
    </div>
  );
};

export default ManageProducts;
