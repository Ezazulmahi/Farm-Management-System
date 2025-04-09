// backend/controllers/productController.js
const Product = require("../models/Product"); // Your Product model

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  const { name, description, price, quantity, category } = req.body;
  try {
    const newProduct = new Product({
      name,
      description,
      price,
      quantity,
      category,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Product deleted" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

const Product = require("../models/Product");

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products." });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: "Failed to create product." });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update product." });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted." });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete product." });
  }
};
