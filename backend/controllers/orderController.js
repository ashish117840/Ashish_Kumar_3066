const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Product = require("../models/Product");

// ===============================
// ⭐ 1. CREATE ORDER
// ===============================
exports.createOrder = async (req, res) => {
  try {
    const userId = req.userId; // from JWT
    const { items } = req.body; // [{ productId, quantity }]

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No items in order" });
    }

    let orderItems = [];
    let total = 0;

    // Fetch product data from MongoDB
    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      }

      const price = product.price;
      total += price * item.quantity;

      orderItems.push({
        productId: product._id.toString(),
        quantity: item.quantity,
        priceAtPurchase: price,
      });
    }

    // Create main order
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Error creating order" });
  }
};

// ===============================
// ⭐ 2. GET USER ORDERS
// ===============================
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching orders",
    });
  }
};

// ===============================
// ⭐ 3. ADMIN — Get All Orders
// ===============================
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching all orders",
    });
  }
};
