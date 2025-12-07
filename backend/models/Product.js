const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

// ➤ Important indexes for exam
productSchema.index({ category: 1 });
productSchema.index({ updatedAt: -1 });

module.exports = mongoose.model("Product", productSchema);
