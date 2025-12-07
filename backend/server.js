require("dotenv").config();  // ⬅ MUST BE FIRST

const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");

// 👉 MongoDB connection
const { connectMongo } = require("./config/mongo");

// 👉 Prisma SQL client
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

// 👉 Connect MongoDB
connectMongo();

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);


app.get("/", (req, res) => {
  res.send("Backend server is running 🚀");
});

// Test route for SQL
app.get("/test-sql", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Test route for MongoDB
app.get("/test-mongo", (req, res) => {
  res.send("MongoDB Connected Successfully");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

