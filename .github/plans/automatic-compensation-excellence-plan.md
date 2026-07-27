# Plano — compensação automática confiável e compreensível

## Objetivo

Fazer da compensação automática o mecanismo mais confiável e fácil de entender
do MacroWeek: após registrar refeições, a pessoa deve saber **qual é sua meta
para hoje**, **quanto ela mudou em relação à meta base**, **por quê**, e o que
isso representa para o saldo semanal — sem números contraditórios entre as telas
de Dia e Semana.

Este plano não cria recurso de IA nem altera a regra de saldo semanal. Ele torna
a regra atual explícita, centralizada, testada e bem apresentada.

## Diagnóstico atual (26/07/2026)

O backend já calcula a meta dinâmica para a data consultada em
`GET /api/week/summary`:

```text
meta dinâmica do dia = (meta semanal - kcal dos dias anteriores) /
                       quantidade de dias de hoje até domingo
```

Isso está conceitualmente correto para a promessa da landing: somente os dias
anteriores compensam a meta de hoje; o que for consumido hoje aparece como
"restante de hoje", sem reescrever retroativamente sua meta.

Há dois problemas relevantes na apresentação:

1. `DayTotalsCard` recebe `dailyTargetKcal` corretamente, mas o contrato da API
   não explica a origem, o delta nem o que fazer quando o orçamento semanal já
   foi ultrapassado.
2. `WeekProjectionCard` recalcula uma suposta sugestão localmente a partir de
   `balance / remainingDays * -1`. Esse número é apenas o ajuste em alguns
   cenários, não a meta diária completa. O texto "Consuma cerca disso" pode
   portanto sugerir, por exemplo, consumir apenas `50 kcal/dia` quando a meta
   real é `1.950 kcal/dia`.

Também há ambiguidade entre os termos "dias restantes" (depois de hoje) e
"dias para distribuir" (incluindo hoje), o que convida a erros de divisor.

## Regra de negócio a consolidar

Para uma data `D` dentro de uma semana de segunda a domingo:

```text
baseDailyKcal       = weeklyTargetKcal / 7
consumedBeforeD     = soma das kcal de segunda até D - 1
daysToDistribute    = número de dias de D até domingo, incluindo D
remainingWeekBudget = weeklyTargetKcal - consumedBeforeD
rawTargetForD       = remainingWeekBudget / daysToDistribute
adjustmentForD      = rawTargetForD - baseDailyKcal
availableToday      = rawTargetForD - consumedOnD
```

As mesmas fórmulas devem valer para proteína, carboidrato e gordura quando a
estratégia for `daily_macros`.

Decisões de produto obrigatórias antes da implementação:

- O cálculo interno **não deve mascarar** meta negativa com zero. Se o saldo já
  foi estourado antes de `D`, `rawTargetForD` continua negativo para preservar a
  verdade matemática; a interface deve dizer que o orçamento semanal foi
  excedido e que não é possível compensá-lo somente reduzindo a alimentação.
- O valor prático exibido como consumo mínimo nunca será negativo: usar
  `max(0, rawTargetForD)` somente nesse campo, acompanhado da diferença/saldo
  real. Não chamar esse valor de "meta ajustada".
- Para domingo, `daysToDistribute = 1`; para segunda, `7`. Dias futuros sem
  itens contam como zero, e dados de dias futuros já registrados devem entrar
  apenas no resumo/saldo, nunca no cálculo da meta de uma data anterior.

## Plano de execução

### P0 — Extrair e testar o motor de compensação

1. Criar `server/src/utils/weeklyCompensation.js` com uma função pura que receba
   meta semanal, os sete totais diários e a data/índice de referência. Ela deve
   devolver um objeto tipado por convenção com:
   - `baseDailyKcal`, `consumedBeforeDate`, `consumedOnDate`,
     `daysToDistribute`, `remainingWeekBudget`, `rawDailyTargetKcal`,
     `dailyAdjustmentKcal` e `availableTodayKcal`;
   - os equivalentes de macros quando existir meta por macros;
   - estado semântico: `on_track`, `reduced_target`, `increased_target`,
     `weekly_budget_exhausted` ou `week_complete`.
2. Migrar `GET /api/week/summary` para usar exclusivamente esse utilitário.
   Manter os campos atuais (`dailyTargetKcal`, `baseDailyKcal` etc.) durante a
   transição, mas preenchê-los a partir da nova estrutura `compensation`.
3. Usar somente `server/src/utils/dates.js` para determinar semana e índices;
   não introduzir `new Date('YYYY-MM-DD')` na regra.
4. Garantir arredondamento apenas na borda de resposta/exibição. Os cálculos
   internos devem manter precisão suficiente para que totais e saldo fechem.
5. Criar testes de unidade para o utilitário, mesmo que seja necessário adicionar
   um runner mínimo ao backend. Casos obrigatórios:
   - segunda-feira sem consumo anterior: meta igual à base;
   - excesso de 200 kcal na segunda: terça reduzida em `200 / 6` kcal;
   - economia de 200 kcal na segunda: terça acrescida em `200 / 6` kcal;
   - quarta com consumo no próprio dia: a meta de quarta não muda; apenas
     `availableToday` muda;
   - domingo: divisor igual a um;
   - orçamento excedido antes da data: meta bruta negativa e estado explícito;
   - macros em `daily_macros`, inclusive saldo negativo de uma macro;
   - semana incompleta e lançamento de itens em data futura.

**Critério de aceite:** o endpoint devolve a mesma compensação para qualquer
cliente e a suíte cobre toda a semana, excesso, economia e orçamento esgotado.

### P0 — Tornar o contrato da API inequívoco

1. Documentar perto da rota o significado de cada campo e a convenção de
   inclusão de hoje no divisor.
2. Retornar uma estrutura semelhante a:

```json
{
  "compensation": {
    "forDate": "2026-07-28",
    "daysToDistribute": 7,
    "baseDailyKcal": 2000,
    "rawDailyTargetKcal": 2000,
    "dailyAdjustmentKcal": 0,
    "consumedBeforeDateKcal": 0,
    "consumedOnDateKcal": 0,
    "availableTodayKcal": 2000,
    "status": "on_track"
  }
}
```

3. Não usar `balance.kcal` como insumo de componentes para recalcular metas.
   `balance` continua sendo o saldo total da semana, útil para o resumo, mas
   não substitui `compensation`.
4. Atualizar o consumidor em `web/src/services/api.js` e manter compatibilidade
   somente até todos os componentes usarem o novo contrato.

**Critério de aceite:** não há divisão ou cálculo de meta diária nos componentes
Vue; o servidor é a única fonte de verdade.

### P1 — Reprojetar a comunicação no dia

1. Em `DayTotalsCard.vue`, apresentar em ordem:
   - **Meta de hoje:** valor da `rawDailyTargetKcal` quando viável;
   - **Ajuste pelo saldo semanal:** `+/- X kcal` versus a meta base, com motivo
     curto ("porque você ficou 200 kcal acima/abaixo até ontem");
   - **Ainda disponível hoje:** `availableTodayKcal`, que considera as refeições
     do próprio dia.
2. Quando `dailyAdjustmentKcal` for muito pequeno após arredondamento, usar
   "Meta base mantida" em vez de sugerir uma precisão artificial.
3. Para `weekly_budget_exhausted`, substituir barras/metas negativas por um
   estado honesto: "O orçamento da semana já foi ultrapassado antes de hoje" +
   saldo excedido + orientação neutra. Não prescrever jejum ou consumo zero.
4. Aplicar a mesma lógica às macros com linguagem de acompanhamento, sem
   permitir que o cumprimento de macros esconda o estouro calórico.
5. Incluir acessibilidade: não depender só de verde/vermelho; usar texto,
   ícone e `aria-live="polite"` na área que muda após registrar item.

**Critério de aceite:** após adicionar, editar ou remover uma refeição, a pessoa
consegue distinguir imediatamente meta ajustada, ajuste da semana e saldo do
dia.

### P1 — Corrigir e simplificar o resumo semanal

1. Remover de `WeekProjectionCard.vue` o cálculo local `remainingPerDay` e
   toda mensagem que trate ajuste como meta diária.
2. Mostrar o mesmo objeto `compensation` recebido pelo backend, com cópia
   explícita: "Sua meta para hoje é X kcal" e "Y kcal em relação à meta base".
3. Diferenciar visualmente:
   - **Compensação:** orçamento redistribuído de hoje até domingo;
   - **Projeção:** estimativa baseada na média até agora.
   Elas respondem perguntas diferentes e não podem compartilhar rótulos.
4. Ajustar `remainingDays` da projeção para significar somente dias após a data
   de referência, e usar `daysToDistribute` exclusivamente para compensação.
5. Garantir que os cards Dia e Semana exibam os mesmos valores para a mesma
   data. A página `/week` deve carregar o resumo da data selecionada ou deixar
   claro que representa hoje; não pode parecer o resumo de uma data e calcular
   outra silenciosamente.

**Critério de aceite:** nenhum texto do app instrui consumir somente o valor do
ajuste; os valores de ambos os cards batem para a mesma consulta.

### P2 — Validação de fluxo e lançamento

1. Adicionar testes de integração para `GET /api/week/summary` com dados reais
   de `DiaryEntry`, confirmando autenticação, pertencimento por usuário e
   recalculação após adicionar/editar/remover/copiar itens.
2. Fazer validação manual em desktop e mobile com este roteiro:
   - configurar meta de 14.000 kcal;
   - registrar 2.200 kcal na segunda;
   - confirmar que terça mostra meta de aproximadamente 1.967 kcal;
   - registrar refeições na terça e confirmar que a meta não se move, apenas o
     disponível hoje;
   - remover a refeição extra de segunda e confirmar retorno à meta base;
   - repetir com meta por macros e no domingo;
   - testar saldo excedido com texto seguro e sem número enganoso.
3. Rodar `npm --prefix web run build` e
   `find server/src -name '*.js' -print0 | xargs -0 -n1 node --check`.
4. Antes de publicar, conferir a landing e alinhar a frase "sugerir como
   compensar" à experiência final. Evitar exemplos rígidos como "50 kcal a
   menos" se a interface estiver explicando a meta completa.

## Fora de escopo

- IA, reconhecimento de refeições, Stripe, planos pagos e alteração de preços.
- Prescrição nutricional individual, recomendações médicas ou alertas clínicos.
- Mudar a semana de segunda–domingo ou permitir uma semana personalizada.
- Alterações globais de marca/nomenclatura.

## Resultado esperado

O MacroWeek passa a oferecer uma compensação que é matematicamente consistente,
idêntica em toda a interface e comunicada como uma nova meta diária completa —
nunca como uma instrução ambígua de comer apenas a diferença.
