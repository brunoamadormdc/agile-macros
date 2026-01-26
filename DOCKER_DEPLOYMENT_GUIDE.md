# Guia de Deploy com Docker - Segurança Máxima 🐳🔒

Este documento detalha a arquitetura e os passos para realizar o deploy do ecossistema **Agile Macros** (Landing Page + Web App + API + Banco de Dados) utilizando Docker em uma VPS.

A arquitetura foca em **Segurança**, **Isolamento** e **Performance**, utilizando Nginx como Gateway único e redes internas privadas.

---

## 🏗️ Arquitetura Proposta

Utilizaremos o **Docker Compose** para orquestrar 5 serviços que se comunicam através de uma rede interna (`agile_network`), sem expor portas desnecessárias para a internet pública.

1.  **Nginx (Gateway)**: Único ponto de entrada (Portas 80 e 443). Faz o Proxy Reverso e gerencia o SSL.
2.  **API (Node.js)**: Backend protegido, acessível apenas pelo Nginx e pelos apps internos.
3.  **Web App (Vue/SPA)**: Container Nginx leve servindo os arquivos estáticos compilados.
4.  **Landing Page (Nuxt)**: Servidor Node.js rodando SSR.
5.  **MongoDB**: Banco de dados isolado, sem acesso externo direto.

---

## 🛠️ 1. Preparação dos Dockerfiles

Crie um `Dockerfile` na raiz de cada subprojeto conforme abaixo.

### 📂 `server/Dockerfile` (API)

```dockerfile
# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --quiet
COPY . .

# Production Stage
FROM node:20-alpine
WORKDIR /app
# Instala dumb-init para gerenciamento correto de processos PID 1
RUN apk add --no-cache dumb-init
# Cria usuário não-privileged para segurança
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app ./
RUN chown -R appuser:appgroup /app

USER appuser
EXPOSE 3001
CMD ["dumb-init", "node", "src/server.js"]
```

### 📂 `web/Dockerfile` (Frontend SPA)

```dockerfile
# Build Stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Argumento de build para injetar a URL da API em tempo de build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Production Stage (Nginx)
FROM nginx:alpine
# Copia os arquivos estáticos buildados
COPY --from=build /app/dist /usr/share/nginx/html
# Copia configuração customizada para SPA (History Mode)
COPY nginx-spa.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

_Nota: Crie um arquivo `web/nginx-spa.conf` com conteúdo simples: `location / { try_files $uri $uri/ /index.html; }`_

### 📂 `landing_page/Dockerfile` (Nuxt SSR)

```dockerfile
# Build Stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production Stage
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/.output ./.output
ENV PORT=3000
ENV HOST=0.0.0.0
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

---

## 🐳 2. O Docker Compose (Orquestração)

Crie o arquivo `docker-compose.yml` na raiz do projeto na VPS:

```yaml
version: "3.8"

services:
  # ----------------------------
  # Banco de Dados (Seguro)
  # ----------------------------
  mongo:
    image: mongo:7.0
    container_name: agile_mongo
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASS}
    volumes:
      - mongo_data:/data/db
    networks:
      - agile_network
    # Segurança: NÃO expor porta 27017 para o host (acesso externo bloqueado)

  # ----------------------------
  # API Backend
  # ----------------------------
  api:
    build: ./server
    container_name: agile_api
    restart: unless-stopped
    environment:
      PORT: 3001
      # Conecta via nome do serviço (dns interno)
      MONGO_URI: mongodb://${MONGO_ROOT_USER}:${MONGO_ROOT_PASS}@mongo:27017/app_counter?authSource=admin
      JWT_SECRET: ${JWT_SECRET}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      NODE_ENV: production
      # CORS deve permitir os domínios abaixo
      CLIENT_URL: https://app.seudominio.com
      LANDING_URL: https://seudominio.com
    networks:
      - agile_network
    depends_on:
      - mongo

  # ----------------------------
  # Web App (Frontend)
  # ----------------------------
  web:
    build:
      context: ./web
      args:
        # A URL da API deve ser a pública (HTTPS) pois roda no browser do cliente
        VITE_API_URL: https://api.seudominio.com/api
    container_name: agile_web
    restart: unless-stopped
    networks:
      - agile_network

  # ----------------------------
  # Landing Page
  # ----------------------------
  landing:
    build: ./landing_page
    container_name: agile_landing
    restart: unless-stopped
    environment:
      PORT: 3000
    networks:
      - agile_network

  # ----------------------------
  # Gateway Nginx + SSL
  # ----------------------------
  nginx:
    image: nginx:alpine
    container_name: agile_gateway
    restart: always
    ports:
      - "80:80" # HTTP (Redireciona pra HTTPS)
      - "443:443" # HTTPS
    volumes:
      - ./nginx_conf:/etc/nginx/conf.d
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    networks:
      - agile_network

  # ----------------------------
  # Renovação Automática SSL
  # ----------------------------
  certbot:
    image: certbot/certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    # Comando para renovar certificados (roda e sai)
    # Configure um cron na VPS para rodar 'docker-compose up certbot' semanalmente
    command: certonly --webroot -w /var/www/certbot --email seu@email.com --agree-tos --no-eff-email -d seudominio.com -d app.seudominio.com -d api.seudominio.com

volumes:
  mongo_data:

networks:
  agile_network:
    driver: bridge
```

---

## 🔐 3. Configuração Nginx (Gateway)

Crie uma pasta `nginx_conf` na VPS e dentro dela o arquivo `app.conf`.
Esta configuração garante **A+ no SSL Labs** e headers de segurança modernos.

```nginx
# app.conf

# Redirecionamento HTTP -> HTTPS
server {
    listen 80;
    server_name seudominio.com app.seudominio.com api.seudominio.com;

    # Necessário para validação do Certbot
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# 1. Landing Page (Domínio Principal)
server {
    listen 443 ssl;
    server_name seudominio.com;

    ssl_certificate /etc/letsencrypt/live/seudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seudominio.com/privkey.pem;

    # Melhores Práticas de SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Cabeçalhos de Segurança
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    location / {
        proxy_pass http://landing:3000; # Passa para container interno
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# 2. Web App (Subdomínio App)
server {
    listen 443 ssl;
    server_name app.seudominio.com;

    ssl_certificate /etc/letsencrypt/live/seudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seudominio.com/privkey.pem;

    location / {
        proxy_pass http://web:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# 3. API (Subdomínio API)
server {
    listen 443 ssl;
    server_name api.seudominio.com;

    ssl_certificate /etc/letsencrypt/live/seudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seudominio.com/privkey.pem;

    location / {
        proxy_pass http://api:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;

        # Aumentar timeout para endpoints de IA que podem demorar
        proxy_read_timeout 60s;
    }
}
```

---

## 🚀 4. Procedimento de Deploy (Passo a Passo)

1.  **Configurar DNS**:
    Aponte os registros A do seu domínio (`@`, `app`, `api`) para o IP da VPS.

2.  **Configurar Variáveis**:
    Crie o arquivo `.env` na VPS com as senhas e chaves da API.

3.  **Gerar Certificados SSL (Primeira Vez)**:
    Como o Nginx vai falhar ao iniciar sem os certificados, precisamos rodar um "dummy" ou comentar as linhas de SSL do nginx temporariamente.

    _Estratégia mais fácil_:
    1. Inicie apenas o Nginx na porta 80.
    2. Rode o container do certbot para gerar os arquivos.
    3. Descomente as linhas de SSL no Nginx e reinicie.

4.  **Deploy Final**:

    ```bash
    docker-compose up -d --build
    ```

5.  **Firewall da VPS (UFW)**:
    Proteja a VPS fechando tudo que não for HTTP/S e SSH.
    ```bash
    ufw allow 80
    ufw allow 443
    ufw allow 22
    ufw enable
    ```
    _Como o Mongo não expõe portas no docker-compose, ele já está seguro._

---

## 🛡️ Resumo de Segurança Implementada

✅ **Isolamento de Rede**: O Banco de Dados não tem IP público. Apenas a API consegue falar com ele.
✅ **Proxy Reverso**: O Nginx protege as aplicações Node, servindo arquivos estáticos e gerenciando conexões SSL.
✅ **Non-Root Users**: Os Dockerfiles da API utilizam usuários sem privilégios.
✅ **Headers HTTP**: Proteção contra XSS, Clickjacking e Sniffing configuradas no Nginx.
