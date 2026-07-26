# Configuração de Domínio para Agile Macros

## Visão Geral da Arquitetura

A aplicação está estruturada em três componentes principais, todos rodando na mesma VPS Contabo:

```
Domain (exemplo.com)
    ├── Landing Page (Nuxt.js) - porta 3000
    ├── App Web (Vue.js/Vite SPA) - porta 3001
    └── API Server (Node.js) - porta 5000
```

Todos os componentes são gerenciados pelo PM2 e servidos através de Nginx.

---

## Pré-requisitos

- ✅ Domínio registrado e acessível
- ✅ VPS Contabo com IP público: `161.97.82.106`
- ✅ Nginx instalado e configurado
- ✅ PM2 rodando os serviços (mw-api e mw-landing)
- ✅ Certificado SSL/TLS (obtido via Let's Encrypt)

---

## 1. Configuração do DNS

Configure os registros DNS no seu registrador de domínio apontando para o IP da VPS:

### Registros A (para domínio raiz e subdomínios)

```dns
# Para o domínio raiz
@  A  161.97.82.106

# Para subdomínios (opcional, recomendado)
www        A  161.97.82.106
app        A  161.97.82.106
landing    A  161.97.82.106
api        A  161.97.82.106
```

### Verificar Propagação do DNS

```bash
# Linux/Mac
nslookup seu-dominio.com
# ou
dig seu-dominio.com

# Windows PowerShell
Resolve-DnsName seu-dominio.com
```

**Tempo de propagação:** Pode levar de 15 minutos a 48 horas

---

## 2. Estrutura de Roteamento

### Mapeamento de URLs

```
┌─────────────────────────────────────────────────────┐
│ seu-dominio.com / www.seu-dominio.com               │
│ ├─ / (raiz)               → Landing Page (porta 3000)│
│ ├─ /app                   → App Web (porta 3001)    │
│ └─ /api/*                 → API Server (porta 5000) │
└─────────────────────────────────────────────────────┘
```

**Alternativamente (com subdomínios):**

```
landing.seu-dominio.com    → Landing Page (porta 3000)
app.seu-dominio.com        → App Web (porta 3001)
api.seu-dominio.com        → API Server (porta 5000)
seu-dominio.com            → Redireciona para /landing ou /app
```

---

## 3. Configuração do Nginx

### Instalação do Nginx

```bash
sudo apt update
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Arquivo de Configuração Principal

Criar arquivo: `/etc/nginx/sites-available/seu-dominio.com`

```nginx
# Upstream para os serviços PM2
upstream api_backend {
    server 127.0.0.1:5000;
}

upstream app_backend {
    server 127.0.0.1:3001;
}

upstream landing_backend {
    server 127.0.0.1:3000;
}

# Redirecionar HTTP para HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name seu-dominio.com www.seu-dominio.com;
    
    # Desafio Let's Encrypt
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # Redirecionar todo o resto para HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# Configuração HTTPS Principal
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name seu-dominio.com www.seu-dominio.com;
    
    # Certificados SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;
    
    # Configurações SSL seguras
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Logs
    access_log /var/log/nginx/seu-dominio-access.log;
    error_log /var/log/nginx/seu-dominio-error.log;
    
    # Tamanho máximo de upload
    client_max_body_size 20M;
    
    # ===== LANDING PAGE (raiz /) =====
    location / {
        # Redirecionar /app para a aplicação web
        if ($request_uri = /app) {
            rewrite ^/app$ /app/ permanent;
        }
        
        # Se não for /app e nem /api, servir landing page
        if ($request_uri !~ ^/(app|api)) {
            proxy_pass http://landing_backend;
        }
        
        # Landing Page (Nuxt - SSR)
        proxy_pass http://landing_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # ===== APP WEB (Vue.js SPA) =====
    location /app {
        # Proxy para o servidor de desenvolvimento/build
        proxy_pass http://app_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
        
        # Cache de assets estáticos
        location ~ \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            proxy_pass http://app_backend;
            expires 30d;
            add_header Cache-Control "public, immutable";
        }
        
        # SPA fallback - enviar index.html para rotas não encontradas
        error_page 404 =200 /app/index.html;
    }
    
    # ===== API SERVER =====
    location /api {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support (se necessário)
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }
    
    # Health check endpoints
    location /health {
        access_log off;
        return 200 "OK";
        add_header Content-Type text/plain;
    }
}
```

### Ativar Configuração

```bash
# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/seu-dominio.com /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Recarregar Nginx
sudo systemctl reload nginx
```

---

## 4. Certificado SSL com Let's Encrypt

### Instalar Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Obter Certificado

```bash
sudo certbot certonly --nginx -d seu-dominio.com -d www.seu-dominio.com
```

**Ou com Webroot (se Nginx já estiver rodando):**

```bash
sudo certbot certonly --webroot -w /var/www/certbot -d seu-dominio.com -d www.seu-dominio.com
```

### Renovação Automática

```bash
# Teste a renovação
sudo certbot renew --dry-run

# Habilitar renovação automática
sudo systemctl enable certbot.timer
```

---

## 5. Configuração do Seu Servidor

### Variáveis de Ambiente

Atualizar `/home/projetos/agile-macros/server/.env`:

```env
# API Configuration
PORT=5000
NODE_ENV=production

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agile_macros
DB_USER=seu_usuario
DB_PASSWORD=sua_senha

# CORS - IMPORTANTE
CORS_ORIGIN=https://seu-dominio.com,https://www.seu-dominio.com
CORS_CREDENTIALS=true

# JWT
JWT_SECRET=sua_chave_secreta_aqui

# API Base URL
API_BASE_URL=https://seu-dominio.com/api
```

### Variáveis da App Web

Atualizar `/home/projetos/agile-macros/web/.env.production`:

```env
VITE_API_BASE_URL=https://seu-dominio.com/api
```

---

## 6. Configuração do PM2 (ecosystem.config.js)

Verificar/atualizar `/home/projetos/agile-macros/ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'mw-api',
      script: './server/src/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      error_file: './logs/err-api.log',
      out_file: './logs/out-api.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
    {
      name: 'mw-landing',
      script: './landing_page/server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/err-landing.log',
      out_file: './logs/out-landing.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
```

---

## 7. Checklist de Deploy

### Pré-Deploy

- [ ] DNS registros configurados e propagados
- [ ] SSL certificado instalado
- [ ] Nginx instalado e configurado
- [ ] PM2 processos rodando (`pm2 list`)
- [ ] Firewall configurado (portas 80, 443 abertas)
- [ ] Variáveis de ambiente definidas

### Deploy Steps

```bash
# 1. SSH na VPS
ssh root@161.97.82.106

# 2. Navegar para o projeto
cd /home/projetos/agile-macros

# 3. Atualizar código
git pull origin dev-launch-free

# 4. Instalar dependências (se necessário)
npm install

# 5. Build da aplicação web
npm run build --prefix web

# 6. Reiniciar serviços PM2
pm2 restart ecosystem.config.js --env production

# 7. Recarregar Nginx
sudo systemctl reload nginx

# 8. Verificar logs
pm2 logs
```

### Pós-Deploy

- [ ] Verificar `https://seu-dominio.com` no navegador
- [ ] Testar landing page
- [ ] Testar `/app` - verificar routing
- [ ] Testar `/api` - verificar conectividade
- [ ] Verificar CORS no console do navegador
- [ ] Monitorar logs: `pm2 logs`

---

## 8. Troubleshooting

### Landing page não carrega

```bash
# Verificar PM2
pm2 list
pm2 logs mw-landing

# Verificar porta 3000
lsof -i :3000
```

### App Web (SPA) com erro 404

```bash
# Problema: Nginx não está fazendo fallback para index.html
# Solução: Verificar configuração de location /app no nginx.conf

# Testar build
npm run build --prefix web
ls -la web/dist/
```

### API não responde

```bash
# Verificar PM2
pm2 logs mw-api

# Testar curl
curl https://seu-dominio.com/api/health

# Verificar CORS
curl -i -X OPTIONS https://seu-dominio.com/api \
  -H "Origin: https://seu-dominio.com" \
  -H "Access-Control-Request-Method: GET"
```

### Erro SSL/HTTPS

```bash
# Verificar certificado
sudo certbot certificates

# Renovar se expirado
sudo certbot renew --force-renewal

# Testar SSL
curl -I https://seu-dominio.com
```

### Nginx não encontra arquivo de config

```bash
# Verificar sintaxe
sudo nginx -t

# Ver erro detalhado
sudo journalctl -u nginx -n 50
```

---

## 9. Monitoramento Contínuo

### Verificar Status dos Serviços

```bash
# PM2
pm2 list
pm2 status

# Nginx
sudo systemctl status nginx
sudo nginx -t

# Logs em tempo real
pm2 monit
pm2 logs

# Nginx logs
tail -f /var/log/nginx/seu-dominio-access.log
tail -f /var/log/nginx/seu-dominio-error.log
```

### Backup de Certificado

```bash
# Backup automático dos certificados Let's Encrypt
sudo tar czf ~/letsencrypt-backup.tar.gz /etc/letsencrypt/
```

---

## 10. URLs Finais

Após configuração completa:

| Componente | URL |
|-----------|-----|
| Landing Page | `https://seu-dominio.com/` |
| App Web | `https://seu-dominio.com/app` |
| API | `https://seu-dominio.com/api` |
| Health Check | `https://seu-dominio.com/health` |

---

## Suporte

Em caso de dúvidas:
- Verificar logs: `pm2 logs`
- Testar conectividade: `curl -v https://seu-dominio.com`
- Verificar DNS: `nslookup seu-dominio.com`
- Verificar Nginx: `sudo nginx -t && sudo systemctl reload nginx`

