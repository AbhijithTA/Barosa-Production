const Category = require("../models/Category");

exports.getAll = async (req, res) => {
  try {
    const result = await Category.find({});
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching categories" });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, subCategory } = req.body;
    console.log(req.body);

    //validate the request body
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res
        .status(400)
        .json({
          message: "Category Name is required and must be a non-empty string",
        });
    }

    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existingCategory) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const category = new Category({
      name: name.trim(),
      ...(subCategory && Array.isArray(subCategory) && { subCategory }),
    });

    //save the category
    const savedCategory = await category.save();

    //send success response
    return res
      .status(201)
      .json({
        message: "Category Created Successfully!",
        category: savedCategory,
      });
  } catch (error) {
    console, log("Error creating category:", error);
    return res.status(500).json({ message: "Error creating category" });
  }
};
