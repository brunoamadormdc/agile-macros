const FoodItem = require("../models/FoodItem");

async function processNewFoodItems(aiItems) {
  if (!aiItems || aiItems.length === 0) return;

  try {
    for (const item of aiItems) {
      if (!item.label) continue;

      const name = item.label.trim();
      if (name.length < 2) continue;

      // Check if exists (case insensitive)
      const exists = await FoodItem.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
      });

      if (!exists) {
        // Calculate per 100g base for storage
        // If the AI gave us "1 banana (100g)" -> kcal 89, protein 1.1...
        // We need to normalize.
        // Assuming AI returns total macros for the quantity 'qty'.
        // We need to know the weight in grams to normalize to 100g.

        let weightInGrams = 100; // Default fallback
        if (item.unit && item.unit.toLowerCase() === "g") {
          weightInGrams = item.qty;
        }
        // If unit is not 'g', it's harder to normalize without AI knowing the weight.
        // But for catalog purposes, maybe we can just store what we have if we assume standard portion?
        // Actually, the user requirement is: "food name doesn't exist -> add to database".
        // It implies we should store it.
        // Best effort: if unit is not 'g', assume the given macros are for "1 unit" or whatever usage.
        // But FoodItem model has a "portion" field default 100.
        // Let's try to normalize if unit is 'g'. If not, maybe skip or store as is with portion = qty?

        // Strategy:
        // IF unit == 'g', we calculate 100g factor.
        // IF unit != 'g', we store as is, but maybe set portion to 100 and just store "as 100g equivalent"?
        // No, that messes up if 1 unit is 200g.
        // Simpler approach for MVP:
        // Only auto-add if unit is 'g' OR 'ml'. If it's 'slice', 'unit', etc, we can't reliably convert to 100g base without more info.

        const unit = item.unit ? item.unit.toLowerCase() : "";
        if (unit === "g" || unit === "ml") {
          if (item.qty <= 0) continue;
          const factor = 100 / item.qty;

          await FoodItem.create({
            name: name,
            calories: item.kcal * factor,
            protein: item.protein_g * factor,
            carbs: item.carbs_g * factor,
            fat: item.fat_g * factor,
            portion: 100,
            source: "AI_GENERATED",
          });
          console.log(
            `Background Job: Added new food item '${name}' to database.`,
          );
        } else {
          // For now, let's skip unknown units to avoid polluting DB with bad data.
          // Or we could store it with 'portion' = 0 or similar to indicate "per serving"?
          // Let's stick to safe 'g'/'ml' auto-learning.
        }
      }
    }
  } catch (err) {
    console.error(
      "Background Job Error: Failed to process new food items",
      err,
    );
  }
}

module.exports = { processNewFoodItems };
