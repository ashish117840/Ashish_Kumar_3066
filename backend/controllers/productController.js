const Product = require("../models/Product");

// ===============================
// ⭐ 1. ADD PRODUCT (Admin Only)
// ===============================
exports.addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error adding product",
      error: error.message,
    });
  }
};

// ===============================
// ⭐ 2. UPDATE PRODUCT
// ===============================
exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const updated = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

// ===============================
// ⭐ 3. DELETE PRODUCT
// ===============================
exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};

// =======================================
// ⭐ 4. GET PRODUCTS (Search + Filter + Pagination + SORTING)
// =======================================
exports.getProducts = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 12 } = req.query;

    let query = {};

    // 🔎 SEARCH
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // 🏷 CATEGORY
    if (category) {
      query.category = category;
    }

    // 📄 PAGINATION
    const skip = (page - 1) * limit;

    // ⭐ EXAM REQUIREMENT: SERVER-SIDE SORTING
    let sortOption = {};

    // Sort by header override
    if (req.headers["x-sort"] === "asc") {
      sortOption.price = 1;
    } else if (req.headers["x-sort"] === "desc") {
      sortOption.price = -1;
    }

    // If query param used (example: ?sort=low)
    if (req.query.sort === "low") sortOption.price = 1;
    if (req.query.sort === "high") sortOption.price = -1;

    // DEFAULT SORT — latest updated
    if (!sortOption.price) {
      sortOption.updatedAt = -1;
    }

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    return res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot fetch products",
      error: error.message,
    });
  }
};
