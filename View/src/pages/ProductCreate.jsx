import React from "react";
import { createProduct } from "../api/productAPI";
import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";

const ProductCreate = () => {
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    await createProduct(data);
    navigate("/admin/products");
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
      <ProductForm onSubmit={handleCreate} submitText="Create" />
    </div>
  );
};

export default ProductCreate;
