# AGENTS.md — MacroWeek

## Objetivo e mapa do monorepo

MacroWeek é um diário alimentar brasileiro orientado por **saldo semanal**: o
consumo de cada dia é visto dentro da meta da semana, não como uma meta diária
isolada. O produto tem três aplicações independentes:

```text
landing_page/  Site institucional e aquisição (Nuxt)
       │ links para o app
       ▼
web/           Aplicação autenticada / SPA PWA (Vue 3 + Vite + Pinia)
       │ HTTP + Bearer JWT
       ▼
server/        API REST e regras de negócio (Express + MongoDB)
       ├── OpenAI: extração de refeições e análise semanal
       ├── Stripe: assinatura Plus e webhook
       └── SMTP: recuperação de senha
```

Não trate `landing_page/` como parte da SPA nem mova páginas entre `web/` e
`landing_page/` sem uma decisão explícita de produto. O `package.json` da raiz
é um workspace apenas de `server` e `web`; a landing mantém instalação e lock
file próprios.

## Onde trabalhar

| Área | Responsabilidade | Pontos de entrada |
| --- | --- | --- |
| `landing_page/` | Marketing, proposta de valor e CTAs para o app | `app.vue`, `nuxt.config.ts` |
| `web/` | Experiência do usuário autenticado, navegação e estado local | `src/main.js`, `src/router/index.js`, `src/stores/`, `src/services/api.js` |
| `server/` | API, autenticação, diário, metas, IA, pagamentos e persistência | `src/server.js`, `src/app.js`, `src/routes/index.js` |
| `server/src/models/` | Modelos Mongo/Mongoose | `User`, `DiaryEntry`, `UserSettings`, `FoodItem`, `FoodPreset`, `WeeklyReview`, `Lead` |
| `server/src/utils/` | Cálculos, datas, validação, e-mail e presets iniciais | não duplicar essas regras no cliente |

Há nomes legados como `app_counter` e `Agile Macros` em pacotes, PWA e alguns
textos. O nome público atual é **MacroWeek**. Não faça uma troca global de
nomenclatura incidental: ela pode envolver domínios, banco, imagens e produto.

## Fluxos que precisam continuar íntegros

1. Cadastro/login emite JWT de 7 dias. A SPA o guarda em `localStorage` como
   `auth_token` e o interceptor Axios o envia como `Authorization: Bearer`.
2. Todas as rotas após `router.use(requireAuth)` exigem autenticação. Dados de
   diário, metas e presets sempre pertencem a `req.user.id`.
3. Um `DiaryEntry` é único por `userId + date` (`YYYY-MM-DD`), e seus `totals`
   devem ser recalculados com `calcTotals()` depois de qualquer alteração em
   `items`. Nunca confie em totais recebidos do cliente.
4. A semana começa na segunda e termina no domingo. Use as funções de
   `server/src/utils/dates.js`; não recalcule essa regra com `Date` de maneira
   ad-hoc por causa de fusos horários.
5. Metas são **semanais** no backend. `fixed_kcal` armazena kcal semanal;
   `daily_macros` recebe macros diários e persiste seus equivalentes semanais.
6. Registro por IA aceita texto e/ou imagem, consome crédito (exceto Plus),
   aplica limite por IP e cota diária, e só então cria itens `source: "ai"`.
   A análise semanal exige ao menos três itens em cada dia da semana e salva uma
   análise por usuário/semana.
7. Stripe deve alterar plano/créditos exclusivamente por webhooks assinados;
   mantenha `/webhook` com `express.raw()` antes de `express.json()`.

## Comandos de desenvolvimento e verificação

Pré-requisito: Node.js 18+ e MongoDB acessível. As dependências do backend/web
podem ser instaladas na raiz; a landing deve ser instalada no próprio diretório.

```bash
# backend + SPA (a partir da raiz)
npm install
npm run dev

# processos separados
npm run dev:server
npm run dev:web

# landing page
npm --prefix landing_page install
npm --prefix landing_page run dev

# builds de produção
npm --prefix web run build
npm --prefix landing_page run build

# validação sintática do backend (não há script de teste)
find server/src -name '*.js' -print0 | xargs -0 -n1 node --check

# importar a tabela TACO; requer Mongo configurado
npm --prefix server run import-taco
```

Portas locais usuais: API `4000`, Vite `5173` e Nuxt `3000`. A SPA usa
`VITE_API_URL` ou, se ausente, `http://localhost:4000`.

Não há testes automatizados neste repositório e eles não são uma exigência no
estado atual do projeto. Para mudanças de comportamento, execute os builds
afetados e faça validação manual do fluxo relevante quando o ambiente e as
credenciais necessários estiverem disponíveis. Não faça chamadas reais para
OpenAI, SMTP ou Stripe sem autorização explícita.

## Configuração e segredos

O arquivo local é `server/.env` (copie `server/.env.example`); ele nunca deve
ser versionado ou exibido. A fonte de verdade para variáveis é
`server/src/config/env.js` e os usos diretos no controller de pagamento.

```env
# necessários para iniciar normalmente
PORT=4000
MONGODB_URI=mongodb://localhost:27017/app_counter
JWT_SECRET=segredo-longo-e-aleatorio
OPENAI_API_KEY=sk-...

# modo de lançamento gratuito: permite subir sem chave OpenAI e desativa IA/pagamento
FREE_LAUNCH_MODE=true

# opcionais
OPENAI_MODEL=gpt-3.5-turbo
WEEKLY_TARGET_KCAL=14000
CLIENT_URL=http://localhost:5173
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
RATE_LIMIT_MAX=2000
RATE_LIMIT_WINDOW_MS=900000
STRIPE_SECRET_KEY=
STRIPE_PRICE_ID_PLUS=
STRIPE_WEBHOOK_SECRET=
```

`MONGODB_URI` e `JWT_SECRET` são os nomes corretos no código. Não os substitua
por `MONGO_URI` ou `jwt_SECRET`. `CLIENT_URL` é usado pelo Stripe, mas o link
de recuperação de senha ainda está fixo em `http://localhost:5173` dentro de
`server/src/routes/index.js`.

## Convenções de implementação

- Backend é CommonJS; web e landing usam ESM/Vue. Preserve o estilo do pacote
  que estiver editando.
- Valide payloads da API com Zod e `validateOrThrow`; encaminhe falhas ao
  middleware de erro. Mantenha o formato de erro `{ error: { message } }`.
- Proteja novas rotas de dados de usuário com `requireAuth` e filtre consultas
  por `req.user.id`. Rotas públicas devem ser uma escolha deliberada.
- Para alterações de API, atualize `web/src/services/api.js`, os stores/páginas
  consumidores e a validação/contrato no servidor na mesma mudança.
- Preserve suporte de PWA da SPA em `web/vite.config.js` e a configuração de
  fallback SPA em `web/nginx-spa.conf`.
- A landing atual é `landing_page/app.vue`. `app_v1.vue` e `app_v2.vue` são
  variações históricas; não edite-as esperando alterar o site publicado.
- As CTAs da landing apontam hoje para `localhost:5173`. Não invente URLs de
  produção: alinhe domínios antes de mudar esses links.

## Execução e deploy

Não há orquestração Docker neste projeto: `docker-compose.yml` foi removido e
nenhum serviço deve ser iniciado com Docker Compose. Execute `server/`, `web/`
e `landing_page/` diretamente pelos comandos Node descritos acima; a
infraestrutura e a configuração de produção são geridas pelo servidor/ambiente
de destino.

Os `Dockerfile`s e a pasta `nginx_conf/` são artefatos legados e não fazem parte
do fluxo atual. Não os atualize nem os use como referência de configuração sem
uma solicitação explícita. Ao configurar produção, defina os domínios e URLs
reais, principalmente `VITE_API_URL` e `CLIENT_URL`.

## Arquivos de referência

- `README.md`: introdução e execução local.
- `PROJECT_HANDOVER.md`: histórico e débitos conhecidos; confirme sempre com o
  código quando houver conflito.
- `DATA_IMPORT_GUIDE.md`: importação da base TACO.
- `DEPLOYMENT_GUIDE.md` e `DOCKER_DEPLOYMENT_GUIDE.md`: documentação que pode
  conter dados anteriores; confrontar com a configuração real antes de usar.
