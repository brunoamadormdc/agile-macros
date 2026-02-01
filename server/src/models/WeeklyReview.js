const mongoose = require("mongoose");

const WeeklyReviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    weekStartDate: { type: String, required: true }, // Format YYYY-MM-DD (Monday)
    analysis: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Ensure one review per week per user
WeeklyReviewSchema.index({ userId: 1, weekStartDate: 1 }, { unique: true });

module.exports = mongoose.model("WeeklyReview", WeeklyReviewSchema);
