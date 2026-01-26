# 🚀 Plano de Lançamento (MVP) - App Counter

Este documento detalha os passos finais necessários para garantir um lançamento seguro, funcional e profissional do App Counter.

## 1. Funcionalidades Críticas (Must-Have)

### 📧 Serviço de Email & Recuperação de Senha

Usuários esquecem senhas. Sem isso, o suporte será inundado manualmente.

- **Serviço de Email**: Implementar `utils/mailer.js` usando **Nodemailer**.
  - _Recomendação_: Usar **Resend** (gratuito para volume inicial, alta entregabilidade) ou SMTP genérico.
- **Backend Flow**:
  - `POST /auth/forgot-password`: Recebe email, gera token JWT temporário (1h), envia link por email.
  - `POST /auth/reset-password`: Recebe token + nova senha, valida e altera no banco.
- **Frontend Flow**:
  - Tela "Esqueci minha Senha" (apenas input de email).
  - Tela "Redefinir Senha" (inputs de nova senha, pegando token da URL).

### 📤 Formulários de Contato & Leads

A Landing Page precisa converter interesse em dados.

- **Integração Landing Page**: O botão "Garantir Acesso Beta" ou formulários de contato devem bater numa rota real.
- **Backend**: Rota `POST /leads` (já temos o model, falta o disparo de email de confirmação "Você está na lista!").
- **Notificação**: Enviar email para o admin (você) quando um novo lead ou venda acontecer.

---

## 2. Estratégia de Testes (QA)

Antes de subir, precisamos garantir que o básico não quebra ("Smoke Testing").

### 🧪 Backend (Sugestão: Jest + Supertest)

Focar nas rotas críticas que envolvem dinheiro ou dados sensíveis.

- [ ] **Auth**: Cadastro falha com senha fraca? Login funciona? Token inválido é rejeitado?
- [ ] **Diário**: Adicionar/Remover alimentos atualiza o saldo corretamente?
- [ ] **Segurança**: Tentar injeção de NoSQL básica na busca de alimentos.

### 🖥️ Frontend (Sugestão: Cypress ou Teste Manual Roteirizado)

Como é MVP, testes manuais bem feitos funcionam bem, mas um E2E simples salva vidas.

- [ ] **Fluxo Crítico**: Criar conta -> Fazer onboarding -> Adicionar Alimento (Manual e TACO) -> Ver Saldo.
- [ ] **Mobile**: Verificar se o modal de alimentos e o menu abrem corretamente no celular.

---

## 3. Segurança & Infraestrutura (Refinamento)

### 🛡️ Segurança Adicional

- **Confirmação de Email (Double Opt-in)**: _Sugestão: Opcional para MVP v1 para não criar atrito, mas essencial na v2._
- **Logs de Produção**: Adicionar `winston` ou similar para monitorar erros em tempo real (não confiar só no console.log).
- **Tratamento de Erros**: Garantir que o backend nunca devolva stack traces completas para o usuário final (rota de erro global).

### 🚀 Checklist de Deploy

- [ ] Variáveis de Ambiente (`.env`) configuradas separadas (Dev vs Prod).
- [ ] Banco de Dados: Garantir índices no MongoDB (email, data do diário) para performance.
- [ ] Backup: Script simples para dump do Mongo diário (pode ser um cron job).

---

## 4. Ordem de Execução Sugerida

1.  **Configurar Nodemailer/Resend** e criar o utilitário de envio.
2.  **Implementar Fluxo de Recuperação de Senha** (Back & Front).
3.  **Conectar Formulário da LP** ao envio de email.
4.  **Rodar Testes Manuais** seguindo o roteiro crítico.
5.  **Refinar Logs e Tratamento de Erros** para produção.
