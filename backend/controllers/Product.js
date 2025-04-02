const { Schema, default: mongoose } = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");

exports.create = async (req, res) => {
  const {
    title,
    description,
    price,
    discountPercentage,
    category,
    subCategory,
    stockQuantity,
    thumbnail,
    images,
  } = req.body;

  try {
    // Validate required fields
    if (
      !title ||
      !description ||
      !price ||
      !category ||
      !subCategory ||
      !stockQuantity ||
      !images
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate that price and discountPercentage are numbers
    if (isNaN(price) || isNaN(discountPercentage)) {
      return res
        .status(400)
        .json({ message: "Price and discountPercentage must be numbers" });
    }

    // Validate that stockQuantity is an object and convert it to Map if so
    if (typeof stockQuantity !== "object" || Array.isArray(stockQuantity)) {
      return res
        .status(400)
        .json({ message: "stockQuantity must be an object" });
    }
    const stockQuantityMap = new Map(Object.entries(stockQuantity));

    // Validate that the subCategory belongs to the given category
    const validSubCategory = await SubCategory.findOne({
      _id: subCategory,
      category: category,
    });

    if (!validSubCategory) {
      return res
        .status(400)
        .json({ message: "SubCategory does not belong to the given category" });
    }

    // Create the new product
    const newProduct = new Product({
      title,
      description,
      price: parseFloat(price), // Ensure price is a number
      discountPercentage: parseFloat(discountPercentage), // Ensure discountPercentage is a number
      category,
      subcategory: subCategory,
      stockQuantity: stockQuantityMap,
      thumbnail,
      images,
    });

    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error adding product, please try again later" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const filter = {};
    const sort = {};
    let skip = 0;
    let limit = 0;

    // Ensure both category and subCategory are applied correctly
    if (req.query.category) {
      filter.category = req.query.category;

      if (req.query.subCategory) {
        filter.subcategory = req.query.subCategory;
      }
    }

    if (!req.query.category && req.query.subCategory) {
      return res
        .status(400)
        .json({ message: "Please provide a category with the subCategory" });
    }

    if (req.query.sort) {
      sort[req.query.sort] = req.query.order === "asc" ? 1 : -1;
    }

    if (req.query.page && req.query.limit) {
      const pageSize = parseInt(req.query.limit, 10) || 10;
      const page = parseInt(req.query.page, 10) || 1;
      skip = pageSize * (page - 1);
      limit = pageSize;
    }

    const totalDocs = await Product.countDocuments(filter);
    const results = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit || 10);

    res.set("X-Total-Count", totalDocs.toString());
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ message: "Error fetching products, please try again later" });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findById(id)
      .populate("category")
      .populate("subcategory");
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting product details, please try again later",
    });
  }
};

exports.updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error updating product, please try again later" });
  }
};

exports.undeleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const unDeleted = await Product.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    );
    res.status(200).json(unDeleted);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error restoring product, please try again later" });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    res.status(200).json(deleted);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error deleting product, please try again later" });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const featuredProducts = await Product.find({
      isFeatured: true,
      isDeleted: { $ne: true },
    })
      .skip(startIndex)
      .limit(limit);

    // getting the total count of featured products
    const totalCount = await Product.countDocuments({ isFeatured: true });

    res.status(200).json({
      data: featuredProducts,
      totalCount,
      currenPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching featured products, please try again later",
    });
  }
};

exports.getLatestProducts = async (req, res) => {
  const categoryName = req.params.category;

  try {
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const categoryId = category._id;
    console.log(categoryId, "categoryId");

    const products = await Product.find({ category: categoryId })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(products);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Error Fetching Products, Please try again later" });
  }
};

exports.featuredProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    const isFeatured = !product.isFeatured; // toggle the state
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { isFeatured },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Error Fetching Product, Please try again later" });
  }
};
