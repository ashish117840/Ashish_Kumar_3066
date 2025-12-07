const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
} = require("../controllers/orderController");

const { authenticate, isAdmin } = require("../middleware/authMiddleware");

// ⭐ Create order (customer)
router.post("/", authenticate, createOrder);

// ⭐ View my orders
router.get("/my", authenticate, getMyOrders);

// ⭐ Admin — view all orders
router.get("/", authenticate, isAdmin, getAllOrders);

module.exports = router;
