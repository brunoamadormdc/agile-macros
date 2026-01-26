Implemente as rotas do diário e a projeção semanal.

Rotas:
1) GET /api/diary/:date
- Se não existir, retorna um objeto "vazio" com date e items=[] e totals=0.

2) POST /api/diary/:date/items
Body:
{
  "type": "catalog" | "preset" | "manual",
  "catalogKey": "pao_frances",
  "presetId": "...",
  "label": "texto livre",
  "qty": 2,
  "unit": "un",
  "macros": { "kcal": 300, "protein_g": 10, "carbs_g": 40, "fat_g": 8 }
}
Regras:
- catalog: usa foodCatalog + qty pra calcular macros
- preset: copia macros do preset
- manual: usa macros enviados
Sempre recalcula totals e salva.

3) DELETE /api/diary/:date/items/:itemIndex
- Remove pelo índice e recalcula totals.

4) GET /api/week/summary?date=YYYY-MM-DD
- Calcula weekStart (Monday)
- Busca os 7 dias da semana
- Retorna:
{
  "weekStart": "...",
  "days": [
    { "date": "...", "kcal": 0, "protein_g":0, "carbs_g":0, "fat_g":0 }
  ],
  "weekTotal": { ... },
  "targetWeek": { "kcal": 14000, "protein_g": null, "carbs_g": null, "fat_g": null },
  "balance": { "kcal": 14000 - consumido },
  "status": "within" | "over",
  "projection": {
    "remainingDays": 3,
    "avgPerDaySoFar": ...,
    "projectedWeekKcal": ...,
    "projectedBalanceKcal": ...
  }
}

IMPORTANTE:
- Nesse MVP, targetWeek.kcal deve vir de um valor fixo configurável no .env (ex: WEEKLY_TARGET_KCAL=14000).
- Depois a gente liga na anamnese. Por enquanto, fixo.
