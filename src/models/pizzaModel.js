const mongoose = require("mongoose");

const pizzaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true },
    size_price: [
      {
        _id: false,
        S: { type: Number, required: true },
        M: { type: Number, required: true },
        L: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("pizza_details", pizzaSchema);
