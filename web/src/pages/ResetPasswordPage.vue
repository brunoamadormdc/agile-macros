<template>
    <div class="auth-page">
        <div class="auth-card">
            <img src="@/assets/logo.png" alt="Agile Macros" class="auth-logo" />
            <h2>Criar Nova Senha</h2>
            <p class="subtitle">Digite sua nova senha abaixo.</p>

            <form @submit.prevent="handleSubmit">
                <label class="field">
                    Nova Senha
                    <input v-model="password" type="password" placeholder="Mínimo 8 caracteres" required
                        minlength="8" />
                </label>

                <label class="field">
                    Confirmar Senha
                    <input v-model="confirmPassword" type="password" placeholder="Repita a senha" required />
                </label>

                <div v-if="success" class="alert success">
                    Senha alterada com sucesso! <router-link to="/login">Login</router-link>
                </div>
                <div v-if="error" class="alert error">{{ error }}</div>

                <button type="submit" class="btn primary full" :disabled="loading || success">
                    {{ loading ? 'Alterando...' : 'Alterar Senha' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { resetPassword } from '../services/api';

const route = useRoute();
const token = route.query.token;

const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref('');
const success = ref(false);

async function handleSubmit() {
    if (password.value !== confirmPassword.value) {
        error.value = 'As senhas não coincidem';
        return;
    }

    loading.value = true;
    error.value = '';

    try {
        await resetPassword(token, password.value);
        success.value = true;
    } catch (err) {
        error.value = err.response?.data?.error?.message || 'Erro ao redefinir senha';
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

.alert.success a {
    color: inherit;
    font-weight: bold;
}

.alert.error {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.2);
}
</style>
