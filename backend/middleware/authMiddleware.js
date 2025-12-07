const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);

    // attach basic info
    req.userId = payload.userId;
    req.userRole = payload.role;

    // optionally fetch full user if you need it:
    // const user = await prisma.user.findUnique({ where: { id: Number(payload.userId) }});
    // req.user = user;

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

exports.isAdmin = (req, res, next) => {
  // must run authenticate before calling isAdmin
  if (!req.userRole) return res.status(403).json({ success: false, message: "Forbidden" });
  if (req.userRole !== "admin") return res.status(403).json({ success: false, message: "Admin only" });
  next();
};
