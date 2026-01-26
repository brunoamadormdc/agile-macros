<template>
  <section class="page auth-page">
    <div class="card auth-card">

      <h2>Criar conta</h2>
      <label class="field">
        Email
        <input v-model="form.email" type="email" placeholder="voce@email.com" />
      </label>
      <label class="field">
        Senha
        <input v-model="form.password" type="password" placeholder="Minimo 6 caracteres" />
      </label>
      <button class="btn" type="button" :disabled="!canSubmit" @click="handleRegister">
        Cadastrar
      </button>
      <p class="muted">
        Ja tem conta?
        <RouterLink to="/login">Entrar</RouterLink>
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

const canSubmit = computed(() => form.email && form.password.length >= 6 && !authStore.loading);

async function handleRegister() {
  const ok = await authStore.register(form);
  if (ok) {
    toast.success('Conta criada!');
    router.push('/today');
  } else if (authStore.error) {
    toast.error(authStore.error);
  }
}
</script>
