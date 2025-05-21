const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");

exports.getAll = async (req, res) => {
  try {
    const result = await Category.find({})
      .populate({
        path: "subCategory",
        select: "name",
      })
      .exec();
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
      return res.status(400).json({
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
    return res.status(201).json({
      message: "Category Created Successfully!",
      category: savedCategory,
    });
  } catch (error) {
    console.log("Error creating category:", error);
    return res.status(500).json({ message: "Error creating category" });
  }
};

exports.createSubCategory = async (req, res) => {
  try {
    const { name, category } = req.body;
    

    //validating the req body
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res
        .status(400)
        .json({
          message:
            "SubCategory name is required and must be a non-empty string",
        });
    }

    //checking if the category exists or not
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    //check if the subcatgory already exists in the same category
    const existingSubCategory = await SubCategory.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      category: category,
    });
    if (existingSubCategory) {
      return res.status(409).json({
        message: "SubCategory already exists for this category",
      });
    }

    //creating the subcategory
    const subCategory = new SubCategory({
      name: name.trim(),
      category: category,
    });

    //saving the subcategory
    const savedSubCategory = await subCategory.save();

    //updating the category with the new subcategory
    existingCategory.subCategory.push(savedSubCategory._id);
    await existingCategory.save();

    //send success response
    return res.status(201).json({
      message: "SubCategory Created Successfully!",
      subCategory: savedSubCategory,
    });
  } catch (error) {
    console.error("Error creating subcategory:", error);
    return res.status(500).json({ message: "Error creating subcategory" });
  }
};
