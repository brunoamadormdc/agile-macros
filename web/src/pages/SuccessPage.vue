<template>
  <div class="page centered-page">
    <div class="card result-card success">
      <div class="icon">🎉</div>
      <h1>Versão gratuita em lançamento</h1>
      <p>O MacroWeek está disponível com os recursos da primeira fase.</p>
      <p class="description">
        Registre suas refeições, acompanhe seu saldo semanal e ajuste suas metas.
      </p>
      <button class="btn btn-primary" @click="goToDashboard">
        Ir para o Dashboard
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goToDashboard() {
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

.btn-primary {
  background: var(--color-primary);
  color: white;
  margin-top: 1rem;
  width: 100%;
}
</style>
