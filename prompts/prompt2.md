No backend, implemente modelos Mongoose para o MVP:

1) DiaryEntry:
- userId: string (default "demo-user")
- date: string (YYYY-MM-DD), unique por userId+date
- items: array de itens consumidos no dia, cada item:
  - label: string (ex: "pão francês")
  - qty: number (ex: 2)
  - unit: string (ex: "un")
  - kcal: number
  - protein_g: number
  - carbs_g: number
  - fat_g: number
  - source: "manual" | "preset"
- totals:
  - kcal, protein_g, carbs_g, fat_g (recalculados server-side)

2) FoodPreset (itens salvos do usuário):
- userId
- name (ex: "café padrão")
- serving:
  - label, qty, unit
- macros:
  - kcal, protein_g, carbs_g, fat_g

Crie util de datas:
- getWeekStart(dateISO) => Monday (YYYY-MM-DD)
- listWeekDates(weekStartISO) => 7 datas (Mon..Sun)
- ensureISODate(input) valida YYYY-MM-DD

Crie também função:
- calcTotals(items) => totals

Atualize rotas para exportar esses módulos.
