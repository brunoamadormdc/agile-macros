const FoodPreset = require('../models/FoodPreset');

async function seedPresetsIfEmpty(userId) {
  const count = await FoodPreset.countDocuments({ userId });
  if (count > 0) {
    return;
  }

  await FoodPreset.insertMany([
    {
      userId,
      name: 'Cafe simples',
      serving: { label: 'Cafe com leite', qty: 1, unit: 'xicara' },
      macros: { kcal: 120, protein_g: 6, carbs_g: 10, fat_g: 5 },
    },
    {
      userId,
      name: 'Almoco rapido',
      serving: { label: 'Prato feito', qty: 1, unit: 'prato' },
      macros: { kcal: 650, protein_g: 35, carbs_g: 70, fat_g: 20 },
    },
  ]);
}

module.exports = { seedPresetsIfEmpty };
