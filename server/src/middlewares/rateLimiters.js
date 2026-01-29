const rateLimit = require("express-rate-limit");

const aiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 5, // Limit each IP/User to 5 requests per windowMs
  message: {
    error: {
      message:
        "Limite de requisições de IA excedido. Tente novamente em 1 minuto.",
      code: "RATE_LIMIT_EXCEEDED",
    },
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = {
  aiRateLimiter,
};
