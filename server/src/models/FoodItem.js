const mongoose = require("mongoose");

const FoodItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    portion: { type: Number, default: 100 }, // Default portion size in grams
    source: { type: String, default: "TACO" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("FoodItem", FoodItemSchema);
