import express from 'express';
import AdminOnlineList from '../models/AdminOrderList.js';

const router = express.Router();

// POST route for creating an order
router.post("/", async (req, res) => {
  try {
    console.log("Received order data:", req.body); // Log incoming data
    const newOrder = new AdminOnlineList(req.body); // Create a new order from request body
    await newOrder.save(); // Save the order to the database
    res.status(201).json({ message: "Order placed successfully" });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ error: "Error saving order" });
  }
});

// Optional: GET route for fetching orders
router.get("/", async (req, res) => {
  try {
    const orders = await AdminOnlineList.find(); // Get all orders from database
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
});

export default router;
