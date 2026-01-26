const mongoose = require('mongoose');

const FoodPresetSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    serving: {
      label: { type: String, required: true },
      qty: { type: Number, required: true },
      unit: { type: String, required: true },
    },
    macros: {
      kcal: { type: Number, required: true },
      protein_g: { type: Number, required: true },
      carbs_g: { type: Number, required: true },
      fat_g: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FoodPreset', FoodPresetSchema);
