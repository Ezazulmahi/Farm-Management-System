import React, { useEffect, useState } from "react";
import { fetchProducts, updateProduct } from "../api/productAPI";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../components/ProductForm";

const ProductEdit = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts().then((data) => {
      const p = data.find((p) => p._id === id);
      setProduct(p);
    });
  }, [id]);

  const handleUpdate = async (updated) => {
    await updateProduct(id, updated);
    navigate("/admin/products");
  };

  if (!product) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
      <ProductForm initialData={product} onSubmit={handleUpdate} submitText="Update" />
    </div>
  );
};

export default ProductEdit;
