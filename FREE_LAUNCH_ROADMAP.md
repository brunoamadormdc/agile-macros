# Free Launch Roadmap

Este roadmap define como preparar uma branch provisória para lançar o app apenas na versão free, com IA bloqueada e sem venda/liberação de funcionalidades premium nesta primeira fase.

## Objetivo

Liberar o app publicamente com o menor risco operacional possível, mantendo:

- cadastro apenas no plano `free`
- créditos de IA zerados por padrão
- qualquer fluxo de IA bloqueado para todos os usuários por falta de créditos
- cópia de refeições liberada no plano free
- funcionalidades premium e cobrança fora da jornada principal

## Branch Provisória

Nome sugerido:

```bash
free-launch
```

Alternativas:

```bash
release/free-only
hotfix/free-launch
```

## Escopo da Versão Free

### Deve continuar funcionando

- cadastro e login
- diário manual
- edição, remoção e duplicação de itens
- busca de alimentos
- metas semanais e saldo semanal
- calculadora TDEE
- copiar refeições para intervalo de datas
- recuperação de senha

### Deve ficar bloqueado nesta branch

- adicionar alimentos via IA (`/diary/:date/ai`)
- análise semanal com IA (`/diary/weekly-analysis`)
- upgrade para Plus
- checkout Stripe
- portal de assinatura
- qualquer UX que incentive uso de IA ou premium como fluxo principal

## Estratégia Recomendada

A forma mais segura para este lançamento provisório é tratar a branch como `free-only mode`.

Em vez de depender apenas da UI:

- bloquear IA no backend
- zerar créditos no backend
- forçar cadastro em `free`
- remover ou esconder pontos de entrada premium no frontend

Isso evita bypass por chamadas diretas à API.

## Mudanças por Área

## 1. Backend: Forçar Operação Free-Only

### Objetivo

Garantir que nenhum usuário consiga usar IA ou ativar plano pago nesta branch, mesmo chamando a API diretamente.

### Arquivos principais

- `server/src/models/User.js`
- `server/src/routes/index.js`
- `server/src/routes/payment.js`
- `server/src/controllers/paymentController.js`
- `server/src/middlewares/aiQuota.js`

### Implementação proposta

1. Forçar novos usuários a nascerem em `plan: "free"` e `credits: 0`.
2. Ajustar o default do schema de usuário para `credits: 0`.
3. Garantir que `POST /api/auth/register` retorne sempre usuário `free`.
4. Desabilitar o endpoint `POST /api/diary/:date/ai`.
5. Desabilitar o endpoint `POST /api/diary/weekly-analysis`.
6. Desabilitar `POST /api/payment/create-checkout-session`.
7. Desabilitar `POST /api/payment/create-portal-session`.
8. Desabilitar `POST /api/subscription/simulate` para evitar troca manual de plano.

### Forma de bloqueio recomendada

Padronizar resposta `403` com mensagem clara, por exemplo:

```json
{
  "error": {
    "message": "Funcionalidade temporariamente indisponível nesta versão de lançamento.",
    "code": "FEATURE_TEMPORARILY_DISABLED"
  }
}
```

### Observação importante

Hoje a IA já depende de créditos em `server/src/routes/index.js`, mas o usuário `free` nasce com `10` créditos em `server/src/models/User.js`. Para o lançamento provisório, isso precisa virar `0`, senão a IA continua acessível.

## 2. Frontend: Remover Dependência de Premium

### Objetivo

Evitar UX quebrada, CTAs falsos e telas que prometem algo que estará desativado nesta branch.

### Arquivos principais

- `web/src/App.vue`
- `web/src/pages/PlansPage.vue`
- `web/src/pages/DayView.vue`
- `web/src/stores/auth.js`
- `web/src/stores/diary.js`
- `web/src/router/index.js`
- `web/src/components/AddFoodForm.vue`
- `web/src/components/UpgradeModal.vue`

### Implementação proposta

1. Liberar a aba de cópia para usuários free em `DayView`.
2. Remover o bloqueio visual "Funcionalidade Premium" da cópia.
3. Esconder botão de upgrade e badge de créditos se não houver uso de IA na branch.
4. Ajustar `PlansPage` para uma de duas opções:
   - opção mais segura: ocultar rota `/plans`
   - opção aceitável: manter página apenas informativa com mensagem "planos pagos em breve"
5. Em `AddFoodForm`, esconder ou desabilitar qualquer entrada de IA.
6. Em `diary.js`, tratar retorno de IA desabilitada sem abrir modal de upgrade.
7. Em `auth.js`, desativar `subscribeToPlus()` e `manageSubscription()` ou garantir que não sejam chamados pela UI.
8. Revisar `UpgradeModal.vue` para:
   - remover gatilhos
   - ou trocar por aviso neutro de "recurso indisponível no lançamento"

## 3. Cópia de Refeições: Mover para Free

### Objetivo

Tornar a funcionalidade de copiar refeições parte do lançamento inicial.

### Estado atual

No frontend, a cópia está bloqueada para `plan === "free"` em `web/src/pages/DayView.vue`.

No backend, o endpoint `POST /api/diary/:date/copy-range` não tem trava por plano.

### Implementação proposta

1. Remover o gate visual de plano no `DayView`.
2. Validar se a jornada de cópia funciona para usuário free do início ao fim.
3. Atualizar textos para remover menção a premium.

### Risco

Baixo. O backend já aceita a operação. O trabalho principal é limpar a UX.

## 4. IA: Bloqueio Temporário Completo

### Objetivo

Garantir que nenhum fluxo dependa de OpenAI neste lançamento.

### Rotas afetadas

- `POST /api/diary/:date/ai`
- `POST /api/diary/weekly-analysis`

### Estratégia recomendada

Mesmo com créditos zerados, bloquear explicitamente as rotas no backend. Isso evita:

- mensagens confusas de saldo insuficiente sugerindo upgrade
- futuras regressões caso alguém altere créditos manualmente
- uso indevido se algum usuário acabar com plano `plus`

### Implementação sugerida

Criar um guard central de feature flag temporária, por exemplo:

- middleware de `free launch mode`
- ou constante simples em `server/src/config/env.js`

Exemplo de variável opcional:

```env
FREE_LAUNCH_MODE=true
```

Com isso, a branch provisória fica explícita e reversível.

## 5. Planos e Pagamentos: Congelar

### Objetivo

Evitar assinatura, mudança de plano e estados híbridos durante o lançamento inicial.

### Fluxos a congelar

- checkout Stripe
- portal Stripe
- simulação de assinatura
- CTAs de upgrade

### Decisão recomendada

Nesta branch, considerar que só existe um plano público:

- `free`

Os demais podem continuar no código como legado, mas não devem estar acessíveis ao usuário final.

## 6. Migração de Dados / Compatibilidade

### Pergunta prática

Se já existirem usuários cadastrados antes do lançamento, decidir entre:

1. manter como estão
2. rebaixar todos para `free`
3. manter plano atual, mas bloquear IA mesmo assim

### Recomendação para esta fase

Se a base ainda é pequena e controlada:

- rebaixar tudo para `free`
- zerar créditos

Se já houver usuários de teste importantes:

- manter dados existentes
- mas bloquear IA por feature flag

Isso evita efeitos colaterais no histórico.

## 7. Ordem de Implementação

Sequência sugerida na branch `free-launch`:

1. Adicionar flag de modo provisório no backend.
2. Bloquear rotas de IA e pagamento no backend.
3. Mudar defaults de usuário para `free` com `0` créditos.
4. Ajustar cadastro para refletir esse estado explicitamente.
5. Liberar cópia de refeições na UI.
6. Remover CTAs de upgrade, modal de upgrade e créditos visíveis.
7. Ocultar ou simplificar página de planos.
8. Validar os fluxos manuais essenciais.
9. Atualizar documentação do lançamento provisório.

## 8. Critérios de Aceite

O roadmap estará implementado corretamente quando:

- novo usuário cadastra e entra sempre como `free`
- novo usuário nasce com `0` créditos
- qualquer tentativa de usar IA retorna bloqueio controlado
- análise semanal com IA não aparece ou não funciona
- cópia de refeições funciona para usuário free
- não existe caminho visível para checkout/upgrade
- app continua utilizável integralmente no modo manual

## 9. Checklist de Verificação Manual

### Auth

- cadastrar novo usuário
- confirmar `plan = free`
- confirmar `credits = 0`
- fazer login/logout

### Diário

- adicionar item manual
- editar item
- duplicar item
- remover item

### Cópia

- copiar todos os itens para intervalo
- copiar itens selecionados
- testar com overwrite ligado e desligado

### IA bloqueada

- tentar usar IA pela interface
- tentar chamar rota de IA direto pela API
- tentar chamar análise semanal direto pela API

### Premium bloqueado

- verificar ausência de CTA de upgrade
- verificar ausência de fluxo de checkout
- verificar ausência de portal de assinatura

## 10. Riscos Conhecidos

- textos antigos no frontend ainda podem mencionar upgrade ou créditos
- usuários antigos podem carregar estado legado `plus`
- algum componente pode continuar abrindo `UpgradeModal`
- páginas `SuccessPage` e `CancelPage` podem ficar órfãs mas ainda roteáveis

## 11. Decisões de Produto para Registrar

Antes de implementar, vale fixar estas decisões nesta branch:

1. A página `/plans` será removida, ocultada ou apenas informativa?
2. Usuários antigos serão rebaixados para free ou apenas congelados?
3. O app mostrará créditos zerados ou esconderá totalmente esse conceito?
4. O bloqueio de IA será por mensagem de "indisponível" ou por "sem créditos"?

### Recomendação objetiva

- esconder créditos na UI
- bloquear IA por "funcionalidade temporariamente indisponível"
- manter `/plans` apenas como página informativa ou redirecionar para `/today`
- congelar pagamentos completamente nesta branch

## 12. Próximo Passo Após Este Roadmap

Implementar o roadmap em uma branch provisória e, ao final, gerar um segundo documento curto com:

- mudanças efetivamente aplicadas
- pontos ainda pendentes
- passos para reativar IA e premium depois do lançamento
