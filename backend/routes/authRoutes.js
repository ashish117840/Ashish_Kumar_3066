const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

// register
router.post("/register", authController.register);

// login
router.post("/login", authController.login);

// logout
router.post("/logout", authenticate, authController.logout);

// get current user
router.get("/me", authenticate, authController.me);

module.exports = router;
