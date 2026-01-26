function calcTotals(items = []) {
  return items.reduce(
    (acc, item) => {
      acc.kcal += item.kcal || 0;
      acc.protein_g += item.protein_g || 0;
      acc.carbs_g += item.carbs_g || 0;
      acc.fat_g += item.fat_g || 0;
      return acc;
    },
    { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
  );
}

module.exports = { calcTotals };
