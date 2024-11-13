const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User_details",
      required: true,
    },
    pizzaItems: [
      {
        pizzaId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "pizza_details",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        size: { type: String, required: true, enum: ["S", "M", "L"] },
      },
    ],
    totalPrice: { type: Number, required: true },
    deliveryAddress: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Pending", "Delivered"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order_details", orderSchema);
