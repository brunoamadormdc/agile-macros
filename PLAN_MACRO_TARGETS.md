# Plano de Implementação: Metas Baseadas em Macros

Este plano detalha as alterações necessárias para permitir que o usuário defina suas metas via **Macros Diários** (Proteína, Carboidratos, Gordura) em vez de apenas Calorias Semanais diretas.

## 1. Backend

### 1.1. Model `UserSettings`

Atualizar o schema para suportar a estratégia de definição de metas.

- Adicionar campo `targetStrategy`: `enum ['fixed_kcal', 'daily_macros']` (default: 'fixed_kcal').
- (Opcional) Manter os campos `weeklyTarget...` existentes para persistência calculada.

### 1.2. API Routes (`server/src/routes/index.js`)

#### `GET /targets/settings` (Novo/Atualizado)

- Retornar todas as configurações: estratégia, meta de kcal, e metas de macros (se houver).
- Se a estratégia for `daily_macros`, o frontend receberá também os valores de macros.

#### `POST /targets/settings`

- Aceitar payload:
  ```json
  {
    "strategy": "fixed_kcal" | "daily_macros",
    "kcal": number (se fixed_kcal),
    "macros": { "protein_g": number, "carbs_g": number, "fat_g": number } (se daily_macros)
  }
  ```
- **Lógica Backend**:
  - Se `daily_macros`:
    - Calcular Kcal Diárias: `(P * 4) + (C * 4) + (F * 9)`
    - Calcular Totais Semanais: `Diário * 7`
    - Salvar `weeklyTargetKcal`, `weeklyTargetProtein_g`, etc.
    - Salvar `targetStrategy = 'daily_macros'`
  - Se `fixed_kcal`:
    - Salvar `weeklyTargetKcal` direto.
    - Zerar ou ignorar macros.
    - Salvar `targetStrategy = 'fixed_kcal'`

#### `GET /week/summary`

- Incluir no retorno os `targetMacros` semanais para que o frontend possa exibir as barras de progresso de macros (feature futura ou atual?).
- O objeto `targetWeek` deve incluir os macros além de kcal.

## 2. Frontend

### 2.1. Store (`week.js` ou `settings.js`)

- Atualizar a store para gerenciar o estado da `targetStrategy`.

### 2.2. Página `WeekPage.vue`

- Refatorar a seção "Meta semanal".
- Adicionar Tabs ou Switch: "Meta por Kcal" vs "Meta por Macros".
- **Modo Kcal**: Input único de Kcal Semanal (comportamento atual).
- **Modo Macros**: 3 Inputs (Proteína, Carbo, Gordura - **Diários**).
  - Exibir cálculo em tempo real: "Isso dará ~X kcal/dia e Y kcal/semana".
- Ao salvar, enviar o payload correto para `POST /targets/settings`.

### 2.3. Componente `WeekProjectionCard.vue`

- Se a estratégia for `daily_macros`, exibir também o progresso dos macros (Meta vs Consumido), ou ao menos destacar que a meta é derivada dos macros.

## 3. Fluxo de Trabalho

1.  Atualizar Schema `UserSettings` e Rotas Backend.
2.  Testar API com curl.
3.  Atualizar Store e Service no Frontend.
4.  Implementar UI de configuração na `WeekPage`.
5.  Ajustar visualização no Dashboard.
