import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../../controllers/UserController.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/", getAllUsers); // Fetch all users
router.put("/:id", updateUser); // Update a user
router.delete("/:id", deleteUser); // Delete a user

export default router;