# Guia de Publicação - Agile Macros

Este guia detalha o passo a passo para colocar seu projeto em produção de forma rápida e segura, utilizando a arquitetura híbrida escolhida: **Vercel** para os Frontends e **VPS** para Backend + Banco de Dados.

## 🏗️ Visão Geral da Arquitetura

1.  **Frontends (Landing Page & Web App)**: Hospedados na Vercel (Gratuito/Rápido/CDN Global).
2.  **Backend (Node.js)**: Hospedado em uma VPS (Virtual Private Server) rodando Ubuntu.
3.  **Banco de Dados (MongoDB)**: Instalado localmente na mesma VPS do backend para menor latência e custo.
4.  **Servidor Web**: **Nginx**. (Recomendado sobre o Apache pois lida melhor com conexões simultâneas e é o padrão da indústria para proxy reverso de aplicações Node.js).

---

## 🛠️ Parte 1: Configuração da VPS (Backend + MongoDB)

**Requisitos**: Uma VPS com Ubuntu 20.04 ou 22.04 LTS (DigitalOcean, AWS, Hetzner, etc). 2GB de RAM é recomendado.

### 1. Acesso e Segurança Básica

Primeiro, acesse sua VPS via SSH:

```bash
ssh root@seu_ip_vps
```

Atualize o sistema:

```bash
apt update && apt upgrade -y
```

Instale ferramentas essenciais:

```bash
apt install curl git ufw -y
```

**Configurar Firewall (UFW):**
Habilite apenas o essencial.

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full' # Liberar portas 80 e 443
ufw enable
```

_Nota: Não libere a porta 27017 (MongoDB) publicamente! Isso é crucial para segurança._

---

### 2. Instalação e Segurança do MongoDB

**Instalação (Ubuntu):**

```bash
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt update
apt install -y mongodb-org
```

**Blindando o MongoDB (Contra Hackers):**
Antes de iniciar ou expor qualquer coisa, vamos configurar a segurança.

1.  Inicie o serviço temporariamente:
    ```bash
    systemctl start mongod
    ```
2.  Conecte ao shell:
    ```bash
    mongosh
    ```
3.  **Crie o Administrador** (Dentro do shell `test>`):
    ```javascript
    use admin
    db.createUser({
      user: "adminMaster",
      pwd: "SUA_SENHA_MUITO_FORTE_AQUI", // Gere um hash complexo
      roles: [{ role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase"]
    })
    ```
4.  **Crie o Usuário do App** (Ainda no shell):
    ```javascript
    use app_counter
    db.createUser({
      user: "appUser",
      pwd: "SENHA_DO_APP_AQUI",
      roles: [{ role: "readWrite", db: "app_counter" }]
    })
    exit
    ```

**Configurar Autenticação Obrigatória:**
Edite o arquivo de configuração:

```bash
nano /etc/mongod.conf
```

Procure e altere/adicione estas linhas:

```yaml
net:
  port: 27017
  bindIp: 127.0.0.1 # CRUCIAL: Mantém o banco acessível APENAS por dentro da VPS

security:
  authorization: enabled
```

Salve (Ctrl+O) e saia (Ctrl+X).

Reinicie o MongoDB para aplicar:

```bash
systemctl restart mongod
systemctl enable mongod
```

_Agora seu banco está seguro. Ninguém de fora consegue acessar diretamente, e internamente só com usuário e senha._

---

### 3. Configuração do Backend (Node.js)

**Instalar Node.js:**

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs
```

**Instalar PM2 (Gerenciador de Processos):**
O PM2 mantém seu app rodando mesmo se crashar e inicia com o sistema.

```bash
npm install -g pm2
```

**Deploy do Código:**

1.  Clone seu repositório na pasta `/var/www/app_backend` (ou use FileZilla/SCP para subir a pasta `server`).
    ```bash
    mkdir -p /var/www/app_backend
    # Suba os arquivos do servidor para cá
    cd /var/www/app_backend
    ```
2.  Instale dependências:
    ```bash
    npm install --production
    ```
3.  **Configurar .env**:
    Crie o arquivo `.env` de produção:
    ```bash
    nano .env
    ```
    Conteúdo:
    ```env
    PORT=3001
    MONGO_URI=mongodb://appUser:SENHA_DO_APP_AQUI@127.0.0.1:27017/app_counter?authSource=app_counter
    JWT_SECRET=UMA_CHAVE_SECRETA_LONGA_E_ALEATORIA
    OPENAI_API_KEY=sk-...
    CLIENT_URL=https://seu-app-web.vercel.app (URL do frontend que vamos criar)
    NODE_ENV=production
    ```
4.  **Iniciar com PM2**:
    ```bash
    pm2 start src/server.js --name "agile-macros-api"
    pm2 save
    pm2 startup
    # Siga o comando que o pm2 startup gerar
    ```

---

### 4. Configuração do Nginx (Proxy Reverso & SSL)

Instale e configure o Nginx para receber requisições da internet e passar para seu Node (porta 3001).

```bash
apt install nginx -y
```

Crie o arquivo de configuração do site:

```bash
nano /etc/nginx/sites-available/api.seudominio.com
```

Conteúdo:

```nginx
server {
    server_name api.seudominio.com; # Seu subdomínio para a API

    location / {
        proxy_pass http://localhost:3001; # Porta do seu Node.js
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ative o site e reinicie o Nginx:

```bash
ln -s /etc/nginx/sites-available/api.seudominio.com /etc/nginx/sites-enabled/
nginx -t # Testar se a config está ok
systemctl restart nginx
```

**Certificado SSL (HTTPS Gratuito com Certbot):**

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d api.seudominio.com
```

_O Certbot vai configurar o HTTPS automaticamente._

---

## 🚀 Parte 2: Frontends (Vercel)

A Vercel é ideal para Vue e Nuxt.

### 1. Web App (Pasta `web`)

1.  Acesse [vercel.com](https://vercel.com) e faça login.
2.  Clique em **"Add New" > "Project"**.
3.  Importe seu repositório Git.
4.  Configure as opções:
    - **Root Directory**: Clique em "Edit" e selecione a pasta `web`.
    - **Framework Preset**: Vite (deve detectar auto).
5.  **Environment Variables**:
    - `VITE_API_URL`: `https://api.seudominio.com/api` (A URL da sua VPS segura).
6.  Clique em **Deploy**.

### 2. Landing Page (Pasta `landing_page`)

1.  Volte à dashboard da Vercel.
2.  **"Add New" > "Project"**.
3.  Importe o MESMO repositório novamente.
4.  Configure as opções:
    - **Root Directory**: Selecione a pasta `landing_page`.
    - **Framework Preset**: Nuxt.js.
5.  **Deploy**.

---

## ✅ Checklist Final

1.  **DNS**:
    - Crie um registro `A` no seu domínio apontando `api` para o IP da VPS.
    - Os registros da Vercel (CNAME/A) serão configurados no painel deles para o site principal.
2.  **Teste de Conexão**:
    - Acesse `https://api.seudominio.com/health` (se tiver rota health) ou tente logar no Web App.
3.  **Backup**:
    - Configure um script simples de backup do MongoDB na VPS (dump diário), enviando para um S3 ou outro local externo, já que o banco é local.

---

### 💡 Dicas Importantes

- **Segurança**: Mantenha a VPS atualizada.
- **Custos**: Essa setup custa aprox. $5-10/mês (VPS) + Domínio. Vercel é grátis para hobby/startups pequenos.
- **Escala**: Se crescer muito, a primeira coisa a fazer é separar o MongoDB para um serviço gerenciado (Mongo Atlas), mas esta configuração aguenta milhares de usuários tranquilamente.
