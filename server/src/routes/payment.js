const express = require("express");
const { requireAuth } = require("../middlewares/auth");
const paymentController = require("../controllers/paymentController");
const env = require("../config/env");

const router = express.Router();

function blockPayments(req, res, next) {
  if (env.paymentsEnabled && !env.freeLaunchMode) {
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
  blockPayments,
  paymentController.createCheckoutSession,
);
router.post(
  "/create-portal-session",
  requireAuth,
  blockPayments,
  paymentController.createPortalSession,
);

module.exports = router;
