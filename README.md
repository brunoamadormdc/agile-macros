# MacroWeek

App de diário alimentar com foco em saldo semanal, metas dinâmicas e recursos assistidos por IA.

## Estrutura

```text
/
├── server/        # API Express + MongoDB
├── web/           # SPA Vue 3 + Vite
├── landing_page/  # Site institucional em Nuxt
└── PROJECT_HANDOVER.md
```

## Stack

- Backend: Node.js, Express, Mongoose, JWT, Zod
- Web app: Vue 3, Vite, Pinia, Vue Router
- Landing page: Nuxt
- Integrações: OpenAI, Stripe, Nodemailer

## Rodando Localmente

Pré-requisitos:

- Node.js 18+
- MongoDB local ou remoto

### Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Default: `http://localhost:4000`

Variáveis mínimas:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/app_counter
JWT_SECRET=sua_chave_secreta
OPENAI_API_KEY=sk-...
```

### Importação de alimentos

Para popular a base com a tabela TACO:

```bash
cd server
npm run import-taco
```

Detalhes em [DATA_IMPORT_GUIDE.md](/home/brunoamadorsolucoes/projetos_pessoais/agile-macros/DATA_IMPORT_GUIDE.md).

### Web App

```bash
cd web
npm install
npm run dev
```

Por padrão, a API é `http://localhost:4000`. Para sobrescrever:

```env
VITE_API_URL=http://localhost:4000
```

### Landing Page

```bash
cd landing_page
npm install
npm run dev
```

### Rodar server + web pela raiz

```bash
npm install
npm run dev
```

## Observações

- O nome técnico legado em alguns `package.json` ainda é `app_counter`
- A documentação operacional mais atual está em [PROJECT_HANDOVER.md](/home/brunoamadorsolucoes/projetos_pessoais/agile-macros/PROJECT_HANDOVER.md)
- Os guias de deploy ainda precisam de uma rodada de alinhamento final com as variáveis reais do código
