const { Schema, default: mongoose } = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");

exports.create = async (req, res) => {
  try {
    const created = new Product(req.body);
    await created.save();
    res.status(201).json(created);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error adding product, please trying again later" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const filter = {};
    const sort = {};
    let skip = 0;
    let limit = 0;

    if (req.query.brand) {
      filter.brand = { $in: req.query.brand };
    }

    if (req.query.category) {
      filter.category = { $in: req.query.category };
    }

    if (req.query.user) {
      filter["isDeleted"] = false;
    }

    if (req.query.sort) {
      sort[req.query.sort] = req.query.order
        ? req.query.order === "asc"
          ? 1
          : -1
        : 1;
    }

    if (req.query.page && req.query.limit) {
      const pageSize = req.query.limit;
      const page = req.query.page;

      skip = pageSize * (page - 1);
      limit = pageSize;
    }

    const totalDocs = await Product.find(filter)
      .sort(sort)
      .populate("brand")
      .countDocuments()
      .exec();
    const results = await Product.find(filter)
      .sort(sort)
      .populate("brand")
      .skip(skip)
      .limit(limit)
      .exec();

    res.set("X-Total-Count", totalDocs);

    res.status(200).json(results);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error fetching products, please try again later" });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findById(id)
      .populate("brand")
      .populate("category");
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
    ).populate("brand");
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
    ).populate("brand");
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
    const featuredProducts = await Product.find({ isFeatured: true }).populate(
      "brand"
    );
    res.status(200).json(featuredProducts);
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
