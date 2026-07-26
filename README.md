# MacroWeek

App de diário alimentar com foco em saldo semanal e metas dinâmicas.

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
- Integrações ativas: Nodemailer (opcional)

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
FREE_LAUNCH_MODE=true
PAYMENTS_ENABLED=false
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

### Rodar os três projetos pela raiz

```bash
npm install
npm --prefix landing_page install
npm run dev
```

Isso inicia API (`4000`), SPA (`5173`) e landing (`3000`). Para encerrar
somente os processos que ocupam essas portas:

```bash
npm run stop:local
```

## Observações

- O nome técnico legado em alguns `package.json` ainda é `app_counter`
- A documentação operacional mais atual está em [PROJECT_HANDOVER.md](/home/brunoamadorsolucoes/projetos_pessoais/agile-macros/PROJECT_HANDOVER.md)
- Os guias de deploy ainda precisam de uma rodada de alinhamento final com as variáveis reais do código


## Produção

### Arquitetura

Em produção, a aplicação é servida por **PM2** (gerenciador de processos) com **Nginx** como proxy reverso. A Web App (Vue SPA) é servida estaticamente pelo Nginx, sem necessidade de processo Node.

```text
                         ┌─────────────────────────────────┐
                         │           Nginx (port 80)        │
                         ├─────────────────────────────────┤
 www.macroweek.com.br  ──┤  proxy_pass → localhost:3000    │──→  mw-landing (Nuxt SSR)
 app.macroweek.com.br  ──┤  root web/dist + try_files      │──→  Arquivos estáticos
 api.macroweek.com.br  ──┤  proxy_pass → localhost:4000    │──→  mw-api (Express)
                         └─────────────────────────────────┘
```

### Componentes

| Processo     | Stack          | Porta | Servido por        |
|--------------|----------------|-------|--------------------|
| `mw-api`     | Express + Node | 4000  | PM2                |
| `mw-landing` | Nuxt (SSR)     | 3000  | PM2                |
| *(Web App)*  | Vue 3 + Vite   | —     | Nginx (estático)   |

A Web App é compilada para `web/dist/` e servida diretamente pelo Nginx com `try_files $uri $uri/ /index.html`, preservando as rotas do Vue Router. Assets com hash recebem cache de 1 ano (`immutable`); `index.html`, service worker e manifest recebem `no-cache`.

Configuração do PM2: `ecosystem.config.js` na raiz do projeto.

### Comandos PM2

```bash
pm2 list                    # Ver status dos processos
pm2 logs                    # Logs em tempo real
pm2 restart mw-api          # Reiniciar um processo específico
pm2 restart all             # Reiniciar todos
pm2 monit                   # Monitor de CPU/memória
pm2 save                    # Salvar estado atual (usado pelo startup)
```

### Build de Produção

```bash
# 1. Instalar dependências
npm install
cd landing_page && npm install && cd ..

# 2. Build da Web App (Vue/Vite)
cd web
VITE_API_URL=https://api.macroweek.com.br npm run build
cd ..

# 3. Build da Landing Page (Nuxt)
cd landing_page
NUXT_PUBLIC_APP_URL=https://app.macroweek.com.br npx nuxi build
cd ..

# 4. Iniciar via PM2 (API + Landing)
pm2 start ecosystem.config.js
pm2 save
```

A Web App não precisa de processo PM2 — o Nginx serve `web/dist/` diretamente.

### Nginx — Configuração

O Nginx atua como proxy reverso com as seguintes configurações de segurança:

**`/etc/nginx/nginx.conf` (diretivas globais):**

- `server_tokens off` — oculta versão do Nginx
- `limit_req_zone` — rate limiting por IP (10 req/s geral, 5 req/s para API)
- `limit_conn_zone` — máximo de conexões simultâneas por IP
- `client_max_body_size 10m` — limite de upload
- `client_body_timeout 12s` / `client_header_timeout 12s` — timeouts contra slowloris
- `ssl_protocols TLSv1.2 TLSv1.3` — apenas TLS moderno

**`/etc/nginx/sites-available/macroweek.conf`:**

```nginx
# Web App (Vue SPA) — servido estaticamente
server {
    listen 80;
    server_name app.macroweek.com.br;
    limit_req zone=general burst=20 nodelay;
    limit_conn addr 10;

    root /home/projetos/agile-macros/web/dist;
    index index.html;

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location ~* (sw\.js|workbox-.*\.js|manifest\.webmanifest)$ {
        add_header Cache-Control "no-cache";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Landing Page (Nuxt SSR via proxy)
server {
    listen 80;
    server_name www.macroweek.com.br;
    limit_req zone=general burst=20 nodelay;
    limit_conn addr 10;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 10s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
}

# API (Express via proxy)
server {
    listen 80;
    server_name api.macroweek.com.br;
    limit_req zone=api burst=10 nodelay;
    limit_conn addr 5;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 10s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
}
```

### SSL/HTTPS

Para gerar certificados Let's Encrypt após configurar o DNS:

```bash
/home/backups/mongodb/setup-ssl.sh
```

O script:
1. Verifica se os 3 domínios resolvem para o IP do servidor
2. Gera certificados via Certbot
3. Atualiza o Nginx para HTTPS com redirect HTTP → HTTPS
4. A renovação automática está ativa via `certbot.timer` (systemd)

### CORS

A API aceita requisições apenas das seguintes origens:

- `https://www.macroweek.com.br`
- `https://app.macroweek.com.br`
- `https://api.macroweek.com.br`
- `http://localhost:5173` (desenvolvimento)
- `http://localhost:3000` (desenvolvimento)

### Variáveis de Ambiente (Produção)

**Server (`server/.env`):**

```env
PORT=4000
MONGODB_URI=mongodb://usuario:senha@127.0.0.1:27017/app_counter?authSource=admin
JWT_SECRET=<chave_gerada_automaticamente>
FREE_LAUNCH_MODE=true
PAYMENTS_ENABLED=false
CLIENT_URL=https://app.macroweek.com.br
LANDING_URL=https://www.macroweek.com.br
WEEKLY_TARGET_KCAL=14000
RATE_LIMIT_MAX=2000
RATE_LIMIT_WINDOW_MS=900000
```

**Web App (`web/.env.production`):**

```env
VITE_API_URL=https://api.macroweek.com.br
```

**Landing Page (`landing_page/.env`):**

```env
NUXT_PUBLIC_APP_URL=https://app.macroweek.com.br
```

### MongoDB

- **Host:** `127.0.0.1:27017` (bind local + IP público)
- **Banco:** `app_counter`
- **Autorização:** SCRAM-SHA-256 habilitada
- **Firewall:** UFW com whitelist de IPs na porta 27017

**Usuários:**

| Usuário              | Role       | Uso                          |
|----------------------|------------|------------------------------|
| `mw_admin`           | root/admin | Gerenciamento do banco       |
| `macroweek_app`      | readWrite  | Aplicação em produção        |
| `app_contabo_projects` | readWrite | Legado (será descontinuado)  |

**Backups:**
- Script: `/home/backups/mongodb/backup.sh`
- Frequência: a cada 3 dias às 03:00 (cron)
- Rotação: mantém os últimos 5 backups
- Logs: `/home/backups/mongodb/backup.log`

### Persistência no Boot

Todos os serviços estão configurados para iniciar automaticamente:

- **PM2:** `pm2-root.service` (systemd, habilitado)
- **Nginx:** `nginx.service` (systemd, habilitado)
- **MongoDB:** `mongod.service` (systemd, habilitado)
