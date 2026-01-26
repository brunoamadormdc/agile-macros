<template>
  <section class="page auth-page">
    <div class="card auth-card">

      <h2>Entrar</h2>
      <label class="field">
        Email
        <input v-model="form.email" type="email" placeholder="voce@email.com" />
      </label>
      <label class="field">
        Senha
        <input v-model="form.password" type="password" placeholder="******" />
      </label>
      <button class="btn" type="button" :disabled="!canSubmit" @click="handleLogin">
        Entrar
      </button>
      <p class="muted">
        Ainda nao tem conta?
        <RouterLink to="/register">Criar agora</RouterLink>
      </p>
      <p class="muted small-link">
        <RouterLink to="/forgot-password">Esqueci minha senha</RouterLink>
      </p>
    </div>
  </section>
</template>



<style scoped>
.auth-logo {
  width: 120px;
  margin: 0 auto 1rem;
  display: block;
}

.eyebrow {
  text-align: center;
}

h2 {
  text-align: center;
}
</style>

<script setup>
import { computed, reactive } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const form = reactive({
  email: '',
  password: '',
});

const canSubmit = computed(() => form.email && form.password && !authStore.loading);

async function handleLogin() {
  const ok = await authStore.login(form);
  if (ok) {
    toast.success('Login realizado!');
    router.push('/today');
  } else if (authStore.error) {
    toast.error(authStore.error);
  }
}
</script>
