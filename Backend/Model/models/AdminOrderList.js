import mongoose from "mongoose";

const AdminOnlineListSchema = new mongoose.Schema({
  products: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      // Add more fields if your product has more (like image, description)
    },
  ],
  paymentMethod: {
    type: String,
    enum: ["cash", "bkash"],
    required: true,
  },
  orderTime: {
    type: Date,
    default: Date.now,
  },
});

const AdminOnlineList = mongoose.model("AdminOnlineList", AdminOnlineListSchema);

export default AdminOnlineList;
