const express = require("express");
const productController = require("../controllers/Product");
const router = express.Router();

router
  .post("/", productController.create)
  .get("/", productController.getAll)


  .get("/featured", productController.getFeaturedProducts)
  .patch("/featured/:id", productController.featuredProduct)
  .get("/latest-products/:category", productController.getLatestProducts)
  .get("/suggestions/:query", productController.getProductSuggestions)
  .get("/search", productController.searchProducts)

  
  .get("/:id", productController.getById)

  .patch("/:id", productController.updateById)
  .patch("/undelete/:id", productController.undeleteById)
  .delete("/:id", productController.deleteById);

module.exports = router;
