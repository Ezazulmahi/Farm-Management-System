       

import express from "express";
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProducts); // GET /api/products
router.post("/", createProduct); // POST /api/products
router.delete("/:id", deleteProduct); // DELETE /api/products/:id
router.put("/:id", updateProduct); // PUT /api/products/:id

export default router;

