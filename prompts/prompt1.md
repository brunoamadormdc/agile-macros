Crie um monorepo com duas pastas: /server e /web.

SERVER:
- Express com rotas /health e /api.
- MongoDB com Mongoose (conexão via MONGODB_URI).
- Estrutura:
  server/src/app.js
  server/src/server.js
  server/src/config/env.js
  server/src/config/db.js
  server/src/middlewares/error.js
  server/src/routes/index.js

WEB:
- Vue 3 + Vite + Pinia + Router.
- Estrutura:
  web/src/main.js
  web/src/router/index.js
  web/src/stores/*
  web/src/pages/*
  web/src/components/*
  web/src/services/api.js (axios)
  web/src/styles.css

Crie package.json no root com scripts para rodar server e web em paralelo.
Inclua README.md com instruções (npm install, npm run dev).
