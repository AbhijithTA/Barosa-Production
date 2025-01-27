const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/Checkout");

router.post(
  "/create-checkout-session",
  checkoutController.createCheckoutSession
);

module.exports = router;
