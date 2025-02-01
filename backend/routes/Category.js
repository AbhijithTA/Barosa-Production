const express = require("express");
const categoryController = require("../controllers/Category");
const router = express.Router();

router
  .get("/", categoryController.getAll)
  .post("/create", categoryController.createCategory)
  .post("/create-subcategory", categoryController.createSubCategory);

module.exports = router;
