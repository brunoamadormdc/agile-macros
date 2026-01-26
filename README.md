# App Counter MVP

Monorepo simples com backend (Express + MongoDB) e frontend (Vue 3 + Vite) para registrar consumo diario, ver saldo semanal e projecao.

## Requisitos

- Node.js 18+
- MongoDB local ou remoto

## Setup

```bash
npm install
```

Crie o arquivo `server/.env` com base em `server/.env.example`.

## Rodar em dev

```bash
npm run dev
```

- API: http://localhost:4000
- Web: http://localhost:5173

## Scripts

- `npm run dev` - server + web em paralelo
- `npm run dev:server` - apenas backend
- `npm run dev:web` - apenas frontend
- `npm run start` - backend em modo producao

## Rotas principais

### Health

```bash
curl http://localhost:4000/health
```

### Buscar alimentos no catalogo

```bash
curl "http://localhost:4000/api/foods/search?q=arroz"
```

### Diario

```bash
# Buscar diario
curl http://localhost:4000/api/diary/2024-12-01

# Adicionar item via catalogo
curl -X POST http://localhost:4000/api/diary/2024-12-01/items \
  -H "Content-Type: application/json" \
  -d '{"type":"catalog","catalogKey":"arroz_cozido","qty":2}'

# Adicionar item manual
curl -X POST http://localhost:4000/api/diary/2024-12-01/items \
  -H "Content-Type: application/json" \
  -d '{"type":"manual","label":"Shake","qty":1,"unit":"copo","macros":{"kcal":300,"protein_g":25,"carbs_g":35,"fat_g":8}}'

# Remover item (index 0)
curl -X DELETE http://localhost:4000/api/diary/2024-12-01/items/0
```

### Presets

```bash
# Listar
curl http://localhost:4000/api/presets

# Criar
curl -X POST http://localhost:4000/api/presets \
  -H "Content-Type: application/json" \
  -d '{"name":"Cafe padrao","serving":{"label":"Copo","qty":1,"unit":"copo"},"macros":{"kcal":120,"protein_g":6,"carbs_g":10,"fat_g":5}}'
```

### Semana

```bash
curl "http://localhost:4000/api/week/summary?date=2024-12-01"
```

## Notas

- Datas sempre em ISO `YYYY-MM-DD` no backend.
- MVP usa `userId` fixo `demo-user`.
- Macros do catalogo sao estimativas aproximadas para demonstracao.
