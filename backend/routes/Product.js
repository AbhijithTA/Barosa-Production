const express = require("express");
const productController = require("../controllers/Product");
const router = express.Router();

router
  .post("/", productController.create)
  .get("/", productController.getAll)

  // ✅ specific routes before dynamic ones
  .get("/featured", productController.getFeaturedProducts)
  .patch("/featured/:id", productController.featuredProduct)
  .get("/latest-products/:category", productController.getLatestProducts)
  .get("/suggestions/:query", productController.getProductSuggestions)
  .get("/search/:query", productController.searchProducts)

  // ❗ keep this AFTER all others
  .get("/:id", productController.getById)

  .patch("/:id", productController.updateById)
  .patch("/undelete/:id", productController.undeleteById)
  .delete("/:id", productController.deleteById);

module.exports = router;
