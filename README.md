# MacroWeek 🥗⚡

> O fim do "Dia do Lixo". Controle sua dieta com liberdade, Inteligência Artificial e estratégia de Saldo Semanal.

O **MacroWeek** é uma plataforma completa de nutrição que combina simplicidade de uso com estratégias avançadas de dieta flexível. Diferente de apps tradicionais que zeram sua meta à meia-noite, o MacroWeek foca no **Balanço Semanal**, permitindo que você coma o que gosta sem culpa, desde que compense ao longo da semana.

![MacroWeek Cover](https://via.placeholder.com/800x400?text=MacroWeek+Preview)

## ✨ Principais Diferenciais

- **🎙️ Voice-to-Log**: Fale o que comeu ("Arroz com feijão e frango") e a IA reconhece e registra os macros em segundos.
- **📉 Saldo Semanal Inteligente**: Exagerou no sábado? O app recalcula automaticamente sua meta diária para os dias restantes, diluindo o excesso sem te deixar passar fome.
- **📋 Smart Copy**: Ferramentas poderosas para quem come a mesma coisa. Copie refeições ou dias inteiros com um clique.
- **🌓 Dark Mode Nativo**: Interface pensada para uso constante, com tema escuro que descansa a vista.
- **📲 PWA (Progressive Web App)**: Instale no celular sem passar pela loja de apps. Funciona offline e gasta menos bateria.

---

## 🛠️ Stack Tecnológico

O projeto utiliza uma arquitetura **Monorepo** moderna e performática:

### 🎨 Frontend (Web App)

- **Framework**: Vue.js 3 + Vite
- **State Management**: Pinia
- **Estilização**: CSS Moderno (Variáveis, Flexbox/Grid) sem frameworks pesados.
- **PWA**: Vite PWA Plugin

### 📢 Landing Page

- **Framework**: Nuxt 3 (SSR para SEO otimizado)
- **Design**: Responsivo e focado em conversão.

### ⚙️ Backend (API)

- **Runtime**: Node.js + Express
- **Banco de Dados**: MongoDB (Mongoose)
- **Segurança**: JWT Auth, Bcrypt.
- **IA**: Integração com OpenAI (GPT-4o/Flash) para processamento de linguagem natural.

---

## 🚀 Como Rodar Localmente

Pré-requisitos: Node.js 18+ e MongoDB rodando localmente (ou URI externa).

### 1. Backend (API)

```bash
cd server
npm install

# Crie um arquivo .env na pasta server com:
# PORT=3001
# MONGO_URI=mongodb://localhost:27017/app_counter
# JWT_SECRET=sua_chave_secreta
# OPENAI_API_KEY=sk-...

npm run dev
```

_O servidor rodará em `http://localhost:3001`_

#### Importação de Dados (Obrigatório)

Para que a busca de alimentos funcione, você deve popular o banco com a tabela TACO:

```bash
npm run import-taco
```

_(Veja `DATA_IMPORT_GUIDE.md` para mais detalhes)_

### 2. Web App (Aplicação Principal)

```bash
cd web
npm install
npm run dev
```

_Acesse em `http://localhost:5173`_

### 3. Landing Page (Site Institucional)

```bash
cd landing_page
npm install
npm run dev
```

_Acesse em `http://localhost:3000`_

---

## 📂 Estrutura do Projeto

```
/
├── landing_page/      # Site de marketing (Nuxt)
├── web/              # Aplicação principal (Vue 3 PWA)
├── server/           # API REST e Lógica de Negócios (Node)
└── DEPLOYMENT_GUIDE.md # Guia completo de publicação (VPS + Vercel)
```

## 📄 Licença

Este projeto é de uso pessoal e educacional.

---

Desenvolvido com 💚 e ☕ por **Bruno Amador**.
