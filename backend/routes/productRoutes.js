const express = require("express");
const router = express.Router();

const {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
} = require("../controllers/productController");

// ⭐ Add product (Admin)
router.post("/", addProduct);

// ⭐ Update product
router.put("/:id", updateProduct);

// ⭐ Delete product
router.delete("/:id", deleteProduct);

// ⭐ Get all products (search, filter, pagination, sorting)
router.get("/", getProducts);

module.exports = router;
