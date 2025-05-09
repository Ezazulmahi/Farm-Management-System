// C:\Users\Asus\Farm-Management-System\Backend\Model\Routes\productRoutes.js

import express from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../controllers/productController.js";  // fixed relative path

const router = express.Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
