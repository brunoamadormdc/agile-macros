<template>
    <div class="auth-page">
        <div class="auth-card">

            <h2>Recuperar Senha</h2>
            <p class="subtitle">Informe seu email para receber o link de reset.</p>

            <form @submit.prevent="handleSubmit">
                <label class="field">
                    Email
                    <input v-model="email" type="email" placeholder="seu@email.com" required />
                </label>

                <div v-if="message" class="alert success">{{ message }}</div>
                <div v-if="error" class="alert error">{{ error }}</div>

                <button type="submit" class="btn primary full" :disabled="loading">
                    {{ loading ? 'Enviando...' : 'Enviar Link' }}
                </button>

                <div class="links">
                    <router-link to="/login">Voltar para Login</router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { forgotPassword } from '../services/api';

const email = ref('');
const loading = ref(false);
const message = ref('');
const error = ref('');

async function handleSubmit() {
    loading.value = true;
    error.value = '';
    message.value = '';
    try {
        await forgotPassword(email.value);
        message.value = 'Se o email existir, você receberá um link em instantes.';
    } catch (err) {
        error.value = err.response?.data?.error?.message || 'Erro ao enviar email';
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.auth-page {
    min-height: calc(100vh - 80px);
    /* Adjust for header if needed, or keep 100vh */
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-body);
    padding-bottom: 20vh;
    /* Force visual lift */
}

.auth-card {
    background: var(--color-bg-card);
    padding: 2rem;
    border-radius: 16px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.auth-logo {
    width: 60px;
    margin: 0 auto 1rem;
    display: block;
}

h2 {
    margin: 0 0 0.5rem;
    text-align: center;
}

.subtitle {
    color: var(--color-text-muted);
    text-align: center;
    margin-bottom: 2rem;
    font-size: 0.9rem;
}

.field {
    display: block;
    margin-bottom: 1.5rem;
    font-weight: 600;
    font-size: 0.9rem;
}

.field input {
    width: 100%;
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid var(--color-border);
    background: var(--color-bg-input);
    color: white;
    margin-top: 0.5rem;
}

.btn.full {
    width: 100%;
}

.alert {
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-size: 0.9rem;
}

.alert.success {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.2);
}

.alert.error {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.2);
}

.links {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 0.9rem;
}

.links a {
    color: var(--color-primary);
    text-decoration: none;
}

.links a:hover {
    text-decoration: underline;
}
</style>
