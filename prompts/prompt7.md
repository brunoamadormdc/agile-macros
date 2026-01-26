Implemente o serviço api.js com axios apontando para o backend (VITE_API_URL).

Requisitos:
- Ao abrir /today ou /day/:date:
  - carrega diary do dia
  - carrega week summary usando a mesma date
  - exibe:
    - Totais do dia
    - WeekProjectionCard com:
      * consumido vs meta semanal
      * saldo kcal
      * status dentro/fora (badge)
      * projeção se continuar na média atual (projectedWeekKcal e projectedBalanceKcal)

- Ao adicionar/remover item no dia:
  - Recarregar diary e week summary automaticamente
  - Mostrar toast/alert simples (pode ser window.alert no MVP)

Garanta que datas usem timezone local do browser mas sejam enviadas como YYYY-MM-DD.
