const express = require("express");
const { requireAuth } = require("../middlewares/auth");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

router.post(
  "/create-checkout-session",
  requireAuth,
  paymentController.createCheckoutSession,
);
router.post(
  "/create-portal-session",
  requireAuth,
  paymentController.createPortalSession,
);

module.exports = router;
