No frontend (Vue 3 + Pinia + Router), crie as telas:

Rotas:
- / (redirect para /today)
- /today => abre diário do dia atual
- /day/:date (YYYY-MM-DD)
- /week (mostra semana atual baseado no dia atual)

Crie store Pinia:
- useDiaryStore:
  state: selectedDate, diary (items + totals), loading, error
  actions: loadDiary(date), addItem(payload), removeItem(index)

- useWeekStore:
  state: weekSummary, loading, error
  actions: loadWeekSummary(date)

Crie components:
- DatePickerSimple (input type="date" que navega /day/:date)
- DayTotalsCard (kcal + macros)
- WeekProjectionCard (saldo, status, projectedWeekKcal)
- ItemsList (lista itens + remover)
- AddFoodForm (3 abas simples):
  1) Buscar catálogo (search + selecionar + qty)
  2) Preset (select preset + adicionar)
  3) Manual (label + kcal/macros)

Crie layout simples, mobile-first.
