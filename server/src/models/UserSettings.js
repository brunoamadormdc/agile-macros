const mongoose = require("mongoose");

const UserSettingsSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    weeklyTargetKcal: { type: Number, required: true },
    weeklyTargetProtein_g: { type: Number, required: true, default: 0 },
    weeklyTargetCarbs_g: { type: Number, required: true, default: 0 },
    weeklyTargetFat_g: { type: Number, required: true, default: 0 },
    targetStrategy: {
      type: String,
      enum: ["fixed_kcal", "daily_macros"],
      default: "fixed_kcal",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("UserSettings", UserSettingsSchema);
