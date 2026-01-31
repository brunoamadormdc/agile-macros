<template>
  <div class="page centered-page">
    <div class="card result-card">
      <div class="icon">⚠️</div>
      <h1>Assinatura Cancelada</h1>
      <p>O processo de assinatura não foi concluído.</p>
      <p class="description">
        Nenhuma cobrança foi realizada. Se você teve algum problema, tente novamente ou entre em contato.
      </p>
      <div class="actions">
        <button class="btn btn-primary" @click="tryAgain">
          Tentar Novamente
        </button>
        <button class="btn ghost" @click="goHome">
          Voltar ao Início
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function tryAgain() {
  router.push('/plans');
}

function goHome() {
  router.push('/');
}
</script>

<style scoped>
.centered-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
}

.result-card {
  text-align: center;
  max-width: 400px;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.icon {
  font-size: 4rem;
}

.description {
  color: var(--color-text-muted);
  font-size: 1.1rem;
}

.actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}
</style>
