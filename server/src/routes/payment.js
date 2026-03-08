const express = require("express");
const { requireAuth } = require("../middlewares/auth");
const paymentController = require("../controllers/paymentController");
const env = require("../config/env");

const router = express.Router();

function blockDuringFreeLaunch(req, res, next) {
  if (!env.freeLaunchMode) {
    return next();
  }

  return res.status(403).json({
    error: {
      message:
        "Funcionalidade temporariamente indisponivel nesta versao de lancamento.",
      code: "FEATURE_TEMPORARILY_DISABLED",
    },
  });
}

router.post(
  "/create-checkout-session",
  requireAuth,
  blockDuringFreeLaunch,
  paymentController.createCheckoutSession,
);
router.post(
  "/create-portal-session",
  requireAuth,
  blockDuringFreeLaunch,
  paymentController.createPortalSession,
);

module.exports = router;
