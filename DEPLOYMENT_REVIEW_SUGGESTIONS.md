# Sugestões de melhoria — deploy com PM2 e Nginx

## Contexto analisado

O `README.md` descreve uma arquitetura com Nginx como proxy reverso e três
processos no PM2:

- `mw-api`: Express em `localhost:4000`;
- `mw-web`: SPA Vue/Vite em `localhost:5173`;
- `mw-landing`: Nuxt SSR em `localhost:3000`.

A arquitetura geral é válida, mas há oportunidades de simplificação,
segurança e reprodutibilidade do deploy.

## Recomendações priorizadas

### 1. Criar e versionar o `ecosystem.config.js` — alta prioridade

O README orienta executar `pm2 start ecosystem.config.js`, mas esse arquivo
não está presente no repositório. O deploy, portanto, não é reproduzível a
partir do código atual.

O arquivo deve declarar ao menos os processos que precisam de Node em produção
(`mw-api` e `mw-landing`), incluindo `cwd`, variáveis de ambiente, política de
reinício, logs e limite de memória.

### 2. Servir a SPA Vue diretamente pelo Nginx — alta prioridade

Após `vite build`, a aplicação em `web/dist` é estática. Não há necessidade de
um processo PM2 nem de um servidor `serve -s` para ela.

Sugestão:

- Nginx atende `app.macroweek.com.br` com `root` apontando para `web/dist`;
- `try_files $uri $uri/ /index.html` preserva as rotas do Vue Router;
- arquivos com hash recebem cache longo e imutável;
- `index.html`, `sw.js` e `manifest.webmanifest` recebem cache curto ou
  `no-cache`, para não atrasar atualizações da PWA.

Isso elimina uma porta, um processo e uma dependência operacional. A descrição
atual cita `serve -s` na porta 5173, mas não existe script ou dependência para
esse servidor no `web/package.json`.

### 3. Usar PM2 somente para API e Nuxt SSR — alta prioridade

O PM2 deve administrar apenas os serviços Node que realmente precisam ficar
em execução: API Express e landing Nuxt SSR.

No ecossistema do PM2, incluir pelo menos:

- `autorestart: true`;
- `max_memory_restart` adequado à capacidade do servidor;
- diretórios de trabalho explícitos (`cwd`);
- arquivos de log separados;
- ambiente de produção explícito (`NODE_ENV=production`);
- recarga controlada no deploy (`pm2 reload ... --update-env`).

### 4. Executar PM2 com usuário de deploy, não root — alta prioridade

O README documenta `pm2-root.service`. É preferível criar um usuário dedicado
e sem privilégios administrativos para executar os processos da aplicação,
com permissões apenas sobre o diretório do projeto e logs.

Nginx pode continuar como serviço do sistema, escutando 80/443 e encaminhando
as requisições para portas locais.

### 5. Tornar a configuração HTTPS auditável — alta prioridade

Os exemplos de `server` blocks mostram apenas `listen 80`. Embora o README
informe que um script configura certificados e redirect, a configuração final
de HTTPS não está documentada no repositório.

Documentar ou versionar, de forma segura, a estrutura esperada:

- servidor em 80 apenas para redirect permanente a HTTPS;
- servidor em 443 com certificado Let's Encrypt;
- `ssl_protocols TLSv1.2 TLSv1.3`;
- HSTS somente depois de validar que todos os subdomínios funcionam em HTTPS;
- cabeçalhos `Host`, `X-Real-IP`, `X-Forwarded-For` e
  `X-Forwarded-Proto` nos proxies para API e landing;
- `proxy_http_version 1.1` e timeouts de proxy explícitos.

### 6. Restringir CORS da API — alta prioridade

O backend atualmente usa `app.use(cors())`, aceitando origens arbitrárias.
Como o frontend de produção é conhecido, a configuração deve permitir apenas:

- `https://app.macroweek.com.br`;
- a landing, se ela realmente fizer chamadas à API;
- origens de desenvolvimento somente fora de produção.

Essa mudança precisa ser validada com os fluxos de login, recuperação de senha
e eventuais chamadas originadas da landing.

### 7. Melhorar o procedimento de build e deploy — média prioridade

Para instalações de produção, preferir `npm ci` a `npm install`, usando os
lockfiles versionados. Um fluxo seguro seria:

1. instalar dependências imutavelmente;
2. gerar os builds;
3. validar `nginx -t` antes de qualquer reload do Nginx;
4. recarregar Nginx sem derrubar conexões;
5. executar `pm2 reload` dos processos Node;
6. verificar os endpoints de saúde e páginas públicas após o deploy.

A API já expõe `GET /health`, que pode servir a esse check e a monitoramento
externo.

### 8. Revisar limites de taxa — média prioridade

Há rate limit na borda Nginx e também no Express. Isso é uma boa defesa em
camadas, mas os valores precisam ser testados em fluxos reais, especialmente
na SPA, que pode disparar várias chamadas em paralelo.

O limite de 5 requisições/segundo na API com `burst=10 nodelay` pode responder
429 de forma brusca a picos legítimos. Avaliar limites específicos e mais
restritivos para login, recuperação de senha e endpoints de IA, mantendo um
limite geral compatível com a navegação normal.

### 9. Corrigir a documentação do MongoDB — média prioridade

O texto atual diz `127.0.0.1:27017` e, ao mesmo tempo, “bind local + IP
público”, o que é contraditório. Se a aplicação e o MongoDB residem no mesmo
servidor, o ideal é escutar apenas em loopback e não expor a porta 27017.

Caso algum acesso remoto seja indispensável, ele deve ser explícito, protegido
por firewall restritivo, autenticação e, preferencialmente, rede privada/VPN.

## Arquitetura alvo sugerida

```text
Internet (HTTPS)
       |
       v
Nginx
  ├─ www.macroweek.com.br  -> proxy para Nuxt SSR em 127.0.0.1:3000 (PM2)
  ├─ app.macroweek.com.br  -> arquivos estáticos de web/dist
  └─ api.macroweek.com.br  -> proxy para Express em 127.0.0.1:4000 (PM2)
```

Essa estrutura preserva o uso de PM2 onde ele traz benefício e deixa ao Nginx
o serviço de conteúdo estático, sua função mais eficiente nesse cenário.

## Pontos para validar antes de implementar

- Confirmar o comando de produção correto para a versão atual do Nuxt;
- confirmar se a landing precisa chamar a API e, portanto, entrar na allowlist
  de CORS;
- conferir o arquivo Nginx efetivamente instalado no servidor antes de
  substituir qualquer configuração;
- validar renovação de certificados e o redirect HTTP → HTTPS;
- testar login, PWA, rotas diretas da SPA, upload de imagem e `/health` após a
  alteração.

---

## Status das Sugestões (Oz - 2026-07-26)

### ✅ Aplicado

| # | Sugestão | Ação |
|---|----------|------|
| 1 | Servir Vue SPA via Nginx (sem PM2/serve) | `mw-web` removido do PM2. Nginx serve `web/dist` diretamente com `try_files $uri $uri/ /index.html` |
| 2 | Versionar `ecosystem.config.js` | Já estava versionado. Atualizado para remover `mw-web` |
| 3 | CORS restrito na API | `app.js` atualizado com `allowedOrigins` explícitos (www, app, api + localhost para dev) |
| 4 | `proxy_http_version 1.1` no Nginx | Adicionado em todos os server blocks de proxy (landing e API) |
| 5 | Cache headers para assets | `/assets/` com `expires 1y` + `immutable`. SW e manifest com `no-cache` |
| 6 | Timeouts de proxy no Nginx | `proxy_connect_timeout 10s`, `proxy_send_timeout 30s`, `proxy_read_timeout 30s` |

### ⏳ Não aplicado agora (pós-lançamento)

| # | Sugestão | Motivo |
|---|----------|--------|
| 7 | PM2 como usuário dedicado (não root) | VPS single-tenant. Risco baixo. Migrar após lançamento estável |
| 8 | HTTPS completo | Script `setup-ssl.sh` pronto. Aguardando configuração de DNS |
| 9 | `npm ci` em vez de `npm install` | Requer `package-lock.json` sincronizado na branch. Aplicar no próximo deploy |

### ❌ Não aplicado (discordância)

| # | Sugestão | Motivo |
|---|----------|--------|
| 10 | MongoDB bind apenas em localhost | Bind em `161.97.82.106` necessário para conexões remotas de desenvolvimento. Segurança garantida pelo UFW com whitelist de IPs |
