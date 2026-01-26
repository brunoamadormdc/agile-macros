const dotenv = require("dotenv");

dotenv.config();

const env = {
  port: process.env.PORT ? Number(process.env.PORT) : 4000,
  mongoUri:
    process.env.MONGODB_URI ||
    "mongodb://admin:admin123@localhost:27017/app_counter?authSource=admin",
  weeklyTargetKcal: process.env.WEEKLY_TARGET_KCAL
    ? Number(process.env.WEEKLY_TARGET_KCAL)
    : 14000,
  openAiKey: process.env.OPENAI_API_KEY || "",
  openAiModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
  jwtSecret: process.env.JWT_SECRET || "change-me",
  // Email Config
  smtpHost: process.env.SMTP_HOST || "smtp.ethereal.email",
  smtpPort: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
  smtpUser: process.env.SMTP_USER || "cassidy.eichmann32@ethereal.email",
  smtpPass: process.env.SMTP_PASS || "T7wYpUPN7ZqqWsWYF1",
  smtpFrom:
    process.env.SMTP_FROM ||
    '"App Counter" <cassidy.eichmann32@ethereal.email>',
};

module.exports = env;
