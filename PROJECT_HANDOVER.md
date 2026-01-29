# 🚀 MacroWeek - Project Handover & Status Report

Este documento serve como um guia de transferência para continuar o desenvolvimento do projeto **MacroWeek** em outro ambiente. Ele detalha a arquitetura, funcionalidades implementadas, recentes melhorias de segurança/UX e os próximos passos.

## 📋 Visão Geral do Projeto

**MacroWeek** é um aplicativo de rastreamento de dieta focado no equilíbrio semanal ("Smart Balance").

- **Diferencial:** Ajusta automaticamente as metas diárias com base no consumo dos dias anteriores da semana.
- **AI-First:** Permite adicionar alimentos via texto ou fotos usando OpenAI (GPT-4o-mini).
- **Modelo de Negócio:** Freemium (Plano Free com créditos limitados vs Plano Plus ilimitado).

## 🏗 Arquitetura (Monorepo)

O projeto está estruturado em um monorepo raiz: `/home/brunoamador/projetos_pessoais/app_counter`

| Pasta           | Tecnologia            | Descrição                                                                                                   |
| --------------- | --------------------- | ----------------------------------------------------------------------------------------------------------- |
| `web/`          | **Vue 3 + Vite**      | Frontend SPA. Usa Pinia para estado e Vue Router. CSS puro (Vanilla) com variáveis para temas (Dark/Light). |
| `server/`       | **Node.js + Express** | Backend API REST. Conecta ao MongoDB. Gerencia Auth, Dados do Diário e Integração OpenAI.                   |
| `landing_page/` | **Nuxt 3**            | Landing page de marketing (separada da app principal).                                                      |

## ✅ Funcionalidades Implementadas

### 1. Core / Diário

- [x] **CRUD de Alimentos:** Adicionar, editar, remover e duplicar itens.
- [x] **Smart Balance:** Cálculo dinâmico de metas diárias (Kcal/Macros) baseado no saldo da semana.
- [x] **Visualização:** Dashboards de visão Diária (`/day/:date`) e Semanal (`/week`).
- [x] **Calculadora TDEE:** Página para estimar gasto calórico e definir metas.

### 2. Inteligência Artificial

- [x] **Log via Texto:** "Comi 2 ovos e um pão".
- [x] **Log via Imagem:** Upload de fotos de pratos.
- [x] **Otimização:** Imagens são redimensionadas (Sharp) antes do envio para economizar tokens e banda.
- [x] **Cotas e Segurança:**
  - Rate Limiting específico para rotas de IA (5 req/min).
  - Cota diária de "Fair Usage" (50 req/dia) até para usuários Plus.
  - Gestão de Créditos para usuários Free.

### 3. UX & UI Moderno

- [x] **Design Responsivo:** Otimizado para Mobile (iPhone), com grids que se adaptam (4 colunas -> 2 colunas).
- [x] **Temas:** Suporte a Dark Mode e Light Mode.
- [x] **Feedback Visual:** Skeleton Loaders para transições suaves de dia.
- [x] **Componentes Custom:** `DatePickerInput` e indicadores de meta "Base vs Dinâmica" nos cards.

### 4. Backend & Segurança

- [x] **Autenticação:** JWT Seguro.
- [x] **Validação:** Zod para validação de entrada.
- [x] **Resiliência:** Retry exponencial para chamadas da OpenAI (erro 429).
- [x] **Sanity Checks:** Verificação de variáveis de ambiente (`OPENAI_API_KEY`, `MONGODB_URI`) no startup.

## 🔄 Status Atual (Onde paramos)

### Últimas Alterações Realizadas:

1.  **Refinamento Mobile:** Ajustamos o formulário de "Adicionar Alimento" para ser touch-friendly (inputs maiores, botões full-width no mobile).
2.  **Date Pickers:** Substituímos os inputs de data padrão do navegador por componentes customizados (`DatePickerInput.vue`) mais elegantes na ferramenta de copiar.
3.  **Layout & Espaçamento:** Melhoramos o respiro (white space) entre as seções do `DayView`.
4.  **Tratamento de Erros:** O Frontend agora exibe mensagens amigáveis para Limites de Rate Limit e Cota de IA.

### Próximos Passos Sugeridos:

1.  **Deploy da Landing Page:** Resolver a questão da `landing_page` no Vercel (sugerido mover para repo separado se continuar dando erro de monorepo).
2.  **Testes E2E:** Implementar testes (Cypress/Playwright) para fluxos críticos (Cadastro -> Add Alimento -> Checar Meta).
3.  **Refinamento do "Smart Balance":** Validar se a lógica de compensação está clara para novos usuários (talvez um tutorial/onboarding).
4.  **Perfil de Usuário:** Permitir edição de dados pessoais e redefinição de senha (já existem telas parciais/rotas).

## 🛠 Como Rodar o Projeto

Você precisará de 3 terminais:

**1. Banco de Dados (se local ou docker):**

```bash
# Se usar docker
docker-compose up -d
```

_(Atualmente configurado para usar MongoDB Atlas/Externa via .env)_

**2. Backend:**

```bash
cd server
npm install
npm run dev
# Roda na porta 4000
```

**3. Frontend:**

```bash
cd web
npm install
npm run dev
# Roda na porta 5173 (ou similar)
```

**4. Landing Page:**

```bash
cd landing_page
npm install
npm run dev
# Roda na porta 3000
```

## 🔑 Variáveis de Ambiente Críticas

Certifique-se de configurar o arquivo `.env` no `server/`:

```env
PORT=4000
MONGODB_URI=...
jwt_SECRET=...
OPENAI_API_KEY=...
```

---

_Gerado automaticamente pelo Agente de Desenvolvimento em 29/01/2026._
