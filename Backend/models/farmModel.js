import mongoose from "mongoose";

const farmSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Farm = mongoose.model("Farm", farmSchema);

export default Farm;
