const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    userId: { type: String }, // optional, for user-specific notifications later
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema);