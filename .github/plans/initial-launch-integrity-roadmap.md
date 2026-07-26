# Roadmap de correção inicial — lançamento sem IA

## Objetivo

Garantir que a versão inicial tenha configuração explícita por ambiente e que
nenhuma chamada à OpenAI possa ser iniciada, mesmo se uma variável de ambiente
for alterada por engano.

## Status da implementação

Concluído nesta branch:

- `web/.env.example`, `server/.env.example` e `landing_page/.env.example`
  criados/atualizados sem variáveis de OpenAI ou Stripe;
- builds de produção da SPA e da landing falham quando suas URLs públicas não
  são fornecidas;
- URL pública do app centralizada no backend e na landing;
- rotas, serviços, interfaces e chamadas de IA removidos do runtime;
- checkout, portal, webhook e a rota de simulação de assinatura bloqueados ou
  removidos; pagamentos exigem explicitamente `PAYMENTS_ENABLED=true` e
  `FREE_LAUNCH_MODE=false` para uma reativação futura;
- `npm run dev`/`npm run dev:all` inicia API, SPA e landing; `npm run
  stop:local` encerra apenas as portas 4000, 5173 e 3000.

Pendente de operação/deploy: remover as credenciais legadas de OpenAI e Stripe
do gerenciador de segredos do ambiente publicado. Elas não são mais lidas pelo
runtime desta branch.

## Diagnóstico registrado em 26/07/2026

### Configuração e conexões

- Não existe `web/.env`, `web/.env.local` ou `web/.env.example`.
- A SPA usa `VITE_API_URL`, mas adota o fallback hardcoded
  `http://localhost:4000` em `web/src/services/api.js`.
- A configuração de API, portanto, **não está integralmente hardcoded**: ela
  pode ser injetada em build por `VITE_API_URL`; o fallback local é que está
  hardcoded.
- Há outros endereços locais a corrigir de forma centralizada:
  - link de redefinição de senha em `server/src/routes/index.js`;
  - retornos do Stripe em `server/src/controllers/paymentController.js`
    (já aceitam `CLIENT_URL`, com fallback local);
  - CTAs da landing em `landing_page/app.vue` (o arquivo publicado).
- O `.gitignore` raiz já ignora arquivos `.env` em subdiretórios; é seguro
  adicionar exemplos versionados (`.env.example`).
- O bloqueio de pagamentos deve abranger checkout, portal e webhook, e possuir
  uma flag positiva independente (`PAYMENTS_ENABLED=false` por padrão).

### IA e estado atual do bloqueio

Com `FREE_LAUNCH_MODE=true` — valor encontrado no ambiente local, sem expor
segredos — as duas rotas que podem chamar OpenAI devolvem `403` antes de
qualquer processamento ou chamada externa:

| Rota | Chamada externa potencial | Bloqueio atual |
| --- | --- | --- |
| `POST /api/diary/:date/ai` | `callOpenAi()` → Responses API | middleware inicial no próprio endpoint |
| `POST /api/diary/weekly-analysis` | `generateWeeklyAnalysis()` → Chat Completions API | verificação no início do handler |

Consequentemente, no ambiente atual não há chamada efetiva à OpenAI. Porém o
bloqueio depende exclusivamente de uma variável de runtime e ainda existem
clientes, imports e serviços de IA no bundle/código. Uma implantação com
`FREE_LAUNCH_MODE` ausente ou `false`, combinada com a chave existente, volta a
habilitar IA. Isso é risco de lançamento e precisa de defesa em profundidade.

Resíduos identificados:

- Cliente: `addDiaryFromAi`, `requestWeeklyAnalysis`, `addFromAi`,
  `AnalysisModal` e lógica de análise em `WeekPage.vue`.
- Servidor: rotas, `analysisService.js`, `foodWorker.js`, quota/rate limiter,
  modelo `WeeklyReview` e o tipo `source: "ai"`.
- Produto/documentação: textos sobre IA em metadados PWA, planos, sucesso de
  pagamento, modal de upgrade e documentação.

## Plano de execução

### P0 — Tornar a configuração explícita

1. Criar `web/.env.example` somente com `VITE_API_URL`, documentando que esse
   valor é incorporado no build Vite e não deve conter segredos.
2. Definir a estratégia de produção para a SPA:
   - preferível: `VITE_API_URL` obrigatório no pipeline de build;
   - manter o fallback para `localhost:4000` apenas em desenvolvimento, com
     erro claro quando ausente em produção.
3. Centralizar a URL pública do app no backend em `env.js` (por exemplo,
   `clientUrl`) e trocar o link de reset hardcoded por essa configuração.
4. Parametrizar no `nuxt.config.ts`/runtime config da landing a URL da SPA e
   trocar exclusivamente os links de `landing_page/app.vue`.
5. Atualizar `README.md` com arquivos de exemplo, variáveis obrigatórias e
   comandos de build por ambiente. Não versionar valores reais.

**Critério de aceite:** um build de produção sem URLs configuradas falha de
forma legível; nenhuma URL de produção é inventada no código.

### P0 — Bloqueio de IA seguro para o lançamento

1. Introduzir uma flag positiva e explícita, por exemplo `AI_ENABLED`, cujo
   padrão seja `false`. `FREE_LAUNCH_MODE` não deve ser o único controle de
   segurança.
2. Aplicar uma guarda compartilhada a todas as rotas de IA antes de quota,
   créditos, validação de payload, processamento de imagem ou acesso ao banco.
   O retorno deve preservar o contrato atual `403` +
   `FEATURE_TEMPORARILY_DISABLED`.
3. Para esta branch de lançamento, remover da SPA os exports/imports e estados
   sem uso de IA (`api.js`, store e `WeekPage.vue`), bem como o modal e textos
   que anunciam IA. Não basta deixar o botão comentado.
4. Remover ou isolar os serviços de IA que ficarem sem referências:
   `analysisService.js`, `foodWorker.js`, quota e limiter específicos. Preservar
   modelos/dados históricos apenas se houver necessidade de migração; caso
   contrário, planejar sua remoção em mudança separada.
5. Retirar a chave OpenAI do ambiente de lançamento e do gestor de segredos
   dessa implantação. A aplicação deve iniciar normalmente com IA desativada e
   sem `OPENAI_API_KEY`.

**Critério de aceite:** buscas no código de runtime não retornam endpoints
`api.openai.com`, `callOpenAi`, `generateWeeklyAnalysis`, nem funções de UI que
os invoquem; requisições manuais às duas rotas retornam 403 e não alteram
créditos, diário ou banco.

### P1 — Consistência de lançamento gratuito

1. Revisar pagamento/Plus: bloquear checkout, portal e webhook por
   `PAYMENTS_ENABLED=false` e por `FREE_LAUNCH_MODE=true`; a interface e os
   textos ainda mencionam assinatura e IA. Ocultar/remover CTAs e mensagens
   incoerentes enquanto pagamento estiver indisponível.
2. Revisar metadados PWA, landing e páginas de sucesso/planos para remover a
   promessa de inteligência artificial nesta fase.
3. Atualizar o modelo de dados e documentação somente após definir se dados
   históricos de IA serão preservados.

## Validação antes de publicar

1. Executar build do `web` com a URL de API do ambiente configurada e build da
   landing com a URL pública da SPA configurada.
2. Executar `find server/src -name '*.js' -print0 | xargs -0 -n1 node --check`.
3. Verificar no artefato final e no fonte: `rg -n 'api.openai.com|callOpenAi|generateWeeklyAnalysis' web server/src`.
4. Com servidor iniciado sem `OPENAI_API_KEY`, testar login, diário manual,
   busca TACO, metas semanais, cópia de diário e recuperação de senha.
5. Chamar autenticado `POST /api/diary/:date/ai` e
   `POST /api/diary/weekly-analysis`; ambos devem responder 403, sem consumo de
   crédito nem criação de `DiaryEntry`/`WeeklyReview`.
6. Confirmar que CTAs da landing, reset de senha e SPA apontam para os domínios
   definidos pelo ambiente de publicação.

## Fora de escopo desta correção inicial

- Troca global de nomes legados (`Agile Macros`/`app_counter`).
- Ativação de Stripe, OpenAI, SMTP ou chamadas reais a esses provedores.
- Migrações destrutivas de dados existentes.
