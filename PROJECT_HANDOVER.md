# MacroWeek - Project Handover

Este documento resume o estado real do projeto neste repositório e serve como ponto de retomada para as próximas sessões de desenvolvimento.

## Visão Geral

MacroWeek é um app de diário alimentar com foco em saldo semanal ("Smart Balance"), registro manual e fluxos assistidos por IA.

- Monorepo com `server/`, `web/` e `landing_page/`
- Backend em Express + MongoDB
- App principal em Vue 3 + Vite + Pinia
- Landing page em Nuxt

## Estado Atual Validado

Itens confirmados no código:

- CRUD de alimentos no diário
- Visões diária e semanal
- Metas semanais com ajuste dinâmico
- Login, cadastro e fluxo de recuperação de senha
- Integração com OpenAI para recursos de análise/log assistido
- Integração com Stripe para checkout, portal e webhook
- Landing page separada da aplicação principal

Validações executadas nesta revisão:

- Build do app web: `npm --prefix web run build`
- Build da landing page: `npm --prefix landing_page run build`

## Estrutura do Repositório

Raiz atual do projeto:

```text
/home/brunoamadorsolucoes/projetos_pessoais/agile-macros
```

Pastas principais:

- `server/`: API REST, autenticação, regras de negócio, IA, Stripe
- `web/`: SPA principal do produto
- `landing_page/`: site institucional

Observação:

- Os `package.json` ainda usam o nome técnico `app_counter` em alguns lugares. Isso é nomenclatura legada, não necessariamente um problema funcional.

## Como Rodar Localmente

Pré-requisitos:

- Node.js 18+
- MongoDB acessível por URI

Opcional:

- Docker para subir Mongo local via `docker-compose.yml`

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

O backend roda por padrão em `http://localhost:4000`.

Variáveis obrigatórias para subir:

- `MONGODB_URI`
- `OPENAI_API_KEY`
- `JWT_SECRET`

### 2. Web App

```bash
cd web
npm install
npm run dev
```

O frontend usa por padrão `http://localhost:4000` como API, a menos que `VITE_API_URL` esteja definido.

### 3. Landing Page

```bash
cd landing_page
npm install
npm run dev
```

### 4. Rodar web + backend pela raiz

```bash
npm install
npm run dev
```

Isso sobe `server` e `web` em paralelo.

## Variáveis de Ambiente Reais

Fonte de verdade atual:

- `server/src/config/env.js`
- usos diretos de `process.env` no backend

Variáveis mapeadas nesta revisão:

### Obrigatórias para operação básica

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/app_counter
JWT_SECRET=uma_chave_longa_e_aleatoria
OPENAI_API_KEY=sk-...
```

### Opcionais já suportadas no código

```env
OPENAI_MODEL=gpt-3.5-turbo
WEEKLY_TARGET_KCAL=14000
CLIENT_URL=http://localhost:5173
SMTP_HOST=smtp.exemplo.com
SMTP_PORT=587
SMTP_USER=usuario
SMTP_PASS=senha
SMTP_FROM=no-reply@exemplo.com
RATE_LIMIT_MAX=2000
RATE_LIMIT_WINDOW_MS=900000
STRIPE_SECRET_KEY=sk_live_ou_test_...
STRIPE_PRICE_ID_PLUS=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Importante:

- O nome correto é `JWT_SECRET`, não `jwt_SECRET`
- O nome correto é `MONGODB_URI`, não `MONGO_URI`
- O backend falha no startup sem `MONGODB_URI` e `OPENAI_API_KEY`
- O fluxo de reset de senha ainda monta link fixo para `http://localhost:5173`, então esse trecho ainda precisa ser parametrizado para produção

## Inconsistências Já Identificadas

- `PROJECT_HANDOVER.md` anterior apontava para um caminho antigo de projeto
- `README.md` anterior citava porta `3001`, mas o default do backend hoje é `4000`
- Parte da documentação antiga citava `MONGO_URI`, mas o código usa `MONGODB_URI`
- Parte da documentação antiga citava `jwt_SECRET`, mas o código usa `JWT_SECRET`
- O handover anterior dizia GPT-4o-mini, mas o serviço de análise semanal hoje usa `OPENAI_MODEL` com fallback para `gpt-3.5-turbo`

## Riscos / Débito Técnico Imediato

- Não há suíte de testes automatizados no repositório
- A documentação de deploy ainda precisa ser alinhada ao estado real das variáveis
- O reset de senha usa URL hardcoded
- Há nomenclatura legada `app_counter` misturada com `MacroWeek`
- Existe alteração local em `web/dev-dist/sw.js` que não foi tocada nesta revisão

## Próximos Passos Recomendados

Ordem sugerida para continuidade:

1. Atualizar os guias de deploy para `MONGODB_URI`, `JWT_SECRET` e portas reais
2. Parametrizar a URL de reset de senha com base em `CLIENT_URL`
3. Criar testes para fluxos críticos
4. Padronizar nomenclatura pública e técnica do projeto

## Arquivos-Chave para Retomada

- `server/src/server.js`
- `server/src/config/env.js`
- `server/src/routes/index.js`
- `server/src/controllers/paymentController.js`
- `server/src/services/analysisService.js`
- `web/src/router/index.js`
- `web/src/services/api.js`

Atualizado em 2026-03-08 após validação manual do repositório.
