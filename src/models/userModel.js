const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: { type: String, unique: true, required: true, trim: true },

    phone: { type: String, unique: true, required: true },
    password: { type: String, min: 8, max: 15, required: true }, // encrypted password
    address: { type: String, trim: true, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User_details", userSchema);
