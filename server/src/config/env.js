const dotenv = require("dotenv");

dotenv.config();

const env = {
  port: process.env.PORT ? Number(process.env.PORT) : 4000,
  mongoUri: process.env.MONGODB_URI,
  weeklyTargetKcal: process.env.WEEKLY_TARGET_KCAL
    ? Number(process.env.WEEKLY_TARGET_KCAL)
    : 14000,
  openAiKey: process.env.OPENAI_API_KEY,
  openAiModel: process.env.OPENAI_MODEL,
  jwtSecret: process.env.JWT_SECRET,
  // Email Config
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  smtpFrom: process.env.SMTP_FROM,
  rateLimitMax: process.env.RATE_LIMIT_MAX
    ? Number(process.env.RATE_LIMIT_MAX)
    : 2000,
  rateLimitWindowMs: process.env.RATE_LIMIT_WINDOW_MS
    ? Number(process.env.RATE_LIMIT_WINDOW_MS)
    : 15 * 60 * 1000,
};

module.exports = env;
