const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    plan: {
      type: String,
      enum: ["free", "basic", "plus", "pro"],
      default: "free",
    },
    credits: { type: Number, default: 20, min: 0 },
    lastRenewalDate: { type: Date, default: Date.now },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    dailyAIUsageCount: { type: Number, default: 0 },
    lastAIRequestDate: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
