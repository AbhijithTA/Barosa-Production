const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/Checkout.js");

router
  .post("/create-checkout-session", checkoutController.createCheckoutSession)
  .get("/get-order", checkoutController.getOrderBySessionId);

module.exports = router;
