const { Schema, default: mongoose } = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");

// exports.create = async (req, res) => {
//   const {
//     title,
//     description,
//     price,
//     discountPercentage,
//     category,
//     subCategory,
//     stockQuantity,
//     thumbnail,
//     images,
//   } = req.body;

//   try {
//     // Validate required fields
//     if (
//       !title ||
//       !description ||
//       !price ||
//       !category ||
//       !subCategory ||
//       !stockQuantity ||
//       !images
//     ) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Validate that price and discountPercentage are numbers
//     if (isNaN(price) || isNaN(discountPercentage)) {
//       return res
//         .status(400)
//         .json({ message: "Price and discountPercentage must be numbers" });
//     }

//     // Validate that stockQuantity is an object and convert it to Map if so
//     if (typeof stockQuantity !== "object" || Array.isArray(stockQuantity)) {
//       return res
//         .status(400)
//         .json({ message: "stockQuantity must be an object" });
//     }
//     const stockQuantityMap = new Map(Object.entries(stockQuantity));

//     // Validate that the subCategory belongs to the given category
//     const validSubCategory = await SubCategory.findOne({
//       _id: subCategory,
//       category: category,
//     });

//     if (!validSubCategory) {
//       return res
//         .status(400)
//         .json({ message: "SubCategory does not belong to the given category" });
//     }

//     // Create the new product
//     const newProduct = new Product({
//       title,
//       description,
//       price: parseFloat(price), // Ensure price is a number
//       discountPercentage: parseFloat(discountPercentage), // Ensure discountPercentage is a number
//       category,
//       subcategory: subCategory,
//       stockQuantity: stockQuantityMap,
//       thumbnail,
//       images,
//     });

//     await newProduct.save();

//     res.status(201).json(newProduct);
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ message: "Error adding product, please try again later" });
//   }
// };

exports.create = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      discountPercentage,
      category,
      subCategory,
    } = req.body;

    // Parse stockQuantity string to object
    const stockQuantity = JSON.parse(req.body.stockQuantity);

    if (
      !title ||
      !description ||
      !price ||
      !category ||
      !subCategory ||
      !stockQuantity
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (isNaN(price) || isNaN(discountPercentage)) {
      return res
        .status(400)
        .json({ message: "Price and discountPercentage must be numbers" });
    }

    const stockQuantityMap = new Map(Object.entries(stockQuantity));

    // Validate subcategory
    const validSubCategory = await SubCategory.findOne({
      _id: subCategory,
      category,
    });

    if (!validSubCategory) {
      return res
        .status(400)
        .json({ message: "SubCategory does not belong to the given category" });
    }

    // Files from Multer
    const thumbnailFile = req.files["thumbnail"]?.[0];
    const imageFiles = req.files["images"] || [];

    const thumbnail = thumbnailFile?.path;
    const images = imageFiles.map((file) => file.path);

    const newProduct = new Product({
      title,
      description,
      price: parseFloat(price),
      discountPercentage: parseFloat(discountPercentage),
      category,
      subcategory: subCategory,
      stockQuantity: stockQuantityMap,
      thumbnail,
      images,
    });

    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error adding product, please try again later" });
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


// Search
    const isSearch = !!req.query.search || !!req.query.query;;
    if (isSearch) {
      const searchTerm = req.query.search || req.query.query;
      const searchRegex = new RegExp(req.query.search, "i");
      filter.$or = [
        { title: searchRegex },
      ];
    }
    

    if (req.query.sort) {
      sort[req.query.sort] = req.query.order === "asc" ? 1 : -1;
    }
// Pagination only when not searching
    if (req.query.page && req.query.limit) {
  const pageSize = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;
  skip = pageSize * (page - 1);
  limit = pageSize;
}
    // if (req.query.page && req.query.limit) {
    //   const pageSize = parseInt(req.query.limit, 10) || 10;
    //   const page = parseInt(req.query.page, 10) || 1;
    //   skip = pageSize * (page - 1);
    //   limit = pageSize;
    // }

    // const totalDocs = await Product.countDocuments(filter);
//     const results = await Product.find(filter)
//       .sort(sort)
//       .skip(skip)
//       .limit(limit || 10);

//     res.set("X-Total-Count", totalDocs.toString());
//     res.status(200).json(results);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res
//       .status(500)
//       .json({ message: "Error fetching products, please try again later" });
//   }
// };

const totalDocs = await Product.countDocuments(filter);
    const query = Product.find(filter).sort(sort);

    if (limit) {
  query.skip(skip).limit(limit);
}
    const results = await query.exec();

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

// exports.updateById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updated = await Product.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });
//     res.status(200).json(updated);
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .json({ message: "Error updating product, please try again later" });
//   }
// };

exports.updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const existingProduct = await Product.findById(id);
    
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedFields = { ...req.body };

    // Handle thumbnail
    if (req.files["thumbnail"]?.[0]) {
      updatedFields.thumbnail = req.files["thumbnail"][0].path;
    }

    // Handle images - start with existing images
    let finalImages = [...existingProduct.images];

    // Remove images marked for deletion
    if (req.body.removedImages) {
      const removedUrls = Array.isArray(req.body.removedImages) 
        ? req.body.removedImages 
        : [req.body.removedImages];
      finalImages = finalImages.filter(img => !removedUrls.includes(img));
    }

    // Add new images (only if they don't already exist)
    if (req.files["images"]) {
      const newImageUrls = req.files["images"].map(file => file.path);
      newImageUrls.forEach(url => {
        if (!finalImages.includes(url)) {
          finalImages.push(url);
        }
      });
    }

    updatedFields.images = finalImages;

    const updated = await Product.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating product" });
  }
};


// exports.updateById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const existingProduct = await Product.findById(id);
//     if (!existingProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     const {
//       title,
//       description,
//       price,
//       discountPercentage,
//       category,
//       subCategory,
//     } = req.body;

//     const stockQuantity = req.body.stockQuantity
//       ? JSON.parse(req.body.stockQuantity)
//       : existingProduct.stockQuantity;

//     const stockQuantityMap = new Map(Object.entries(stockQuantity));

//     // Handle image updates
//     let thumbnail = existingProduct.thumbnail;
//     let images = existingProduct.images;

//     const thumbnailFile = req.files["thumbnail"]?.[0];
//     const imageFiles = req.files["images"] || [];

//     if (thumbnailFile) {
//       thumbnail = thumbnailFile.path;
//     }

//     if (imageFiles.length > 0) {
//       images = imageFiles.map((file) => file.path);
//     }

//     const updatedProduct = await Product.findByIdAndUpdate(
//       id,
//       {
//         title,
//         description,
//         price: parseFloat(price),
//         discountPercentage: parseFloat(discountPercentage),
//         category,
//         subcategory: subCategory,
//         stockQuantity: stockQuantityMap,
//         thumbnail,
//         images,
//       },
//       { new: true }
//     );

//     res.status(200).json(updatedProduct);
//   } catch (error) {
//     console.error("Error updating product:", error);
//     res
//       .status(500)
//       .json({ message: "Error updating product, please try again later" });
//   }
// };


exports.undeleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const restored = await Product.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    );
    res.status(200).json(restored);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error restoring product, please try again later" });
  }
};

exports.softdeleteById = async (req, res) => {
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
      .json({ message: "Error hiding product" });
  }
};
exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.status(200).json({ message: "Product successfully deleted" });
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
  console.log(categoryName, "categoryName");

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

exports.getProductSuggestions = async (req, res) => {
  try {
    const { query } = req.params;
   
    if (!query || query.trim().length < 2) {
      return res.json([]);
    }
    const suggestions = await Product.find({
      title: { $regex: query, $options: "i" },
    })
      .limit(5)
      .select("title description");

    res.json(suggestions);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error Fetching Suggestions, Please try again Later" });
  }
};


exports.searchProducts = async (req, res) =>{
  try {
    const query = req.query.q;
    console.log(query, "query");
    if(!query) return res.status(400).json({ message: "Query is required" });

    const products = await Product.find({
      title: { $regex: query, $options: "i" },
      isDeleted: false,
    });

    res.json(products);
  }catch(error){
    res.status(500).json({message:"Server error", error});
  }
}