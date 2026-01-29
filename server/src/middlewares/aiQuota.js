const User = require("../models/User");

const DAILY_AI_LIMIT = 50; // Hardcoded limit for now as per updated plan

async function checkAIUsageLimit(req, res, next) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: { message: "User not found" } });
    }

    const now = new Date();
    const lastRequest = new Date(user.lastAIRequestDate);

    // Check if it's a new day (simple date comparison)
    const isToday =
      now.getDate() === lastRequest.getDate() &&
      now.getMonth() === lastRequest.getMonth() &&
      now.getFullYear() === lastRequest.getFullYear();

    if (!isToday) {
      // Reset counter if it's a new day
      user.dailyAIUsageCount = 0;
      user.lastAIRequestDate = now;
      await user.save();
    }

    if (user.dailyAIUsageCount >= DAILY_AI_LIMIT) {
      return res.status(403).json({
        error: {
          message:
            "Limite diário de uso de IA atingido (50 requisições). Tente novamente amanhã.",
          code: "AI_DAILY_QUOTA_EXCEEDED",
        },
      });
    }

    // Attach tracking function to req for use in the controller if successful
    req.incrementAIUsage = async () => {
      await User.findByIdAndUpdate(userId, {
        $inc: { dailyAIUsageCount: 1 },
        lastAIRequestDate: new Date(),
      });
    };

    next();
  } catch (error) {
    console.error("AI Quota Middleware Error:", error);
    next(error);
  }
}

module.exports = { checkAIUsageLimit };
