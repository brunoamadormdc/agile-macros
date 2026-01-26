Implemente FoodPresets para permitir "repetir refeição".

Rotas:
- GET /api/presets
- POST /api/presets
  Body: { name, macros: {kcal, protein_g, carbs_g, fat_g}, serving: {label, qty, unit} }
- DELETE /api/presets/:id

Valide com Zod.
No POST, normalize números (float) e não permitir valores negativos.
