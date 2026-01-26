<template>
    <div v-if="visible" class="modal-overlay" @click.self="close">
        <div class="modal">
            <div class="modal-header">
                <div class="icon-wrapper">
                    ⚡
                </div>
                <h2>Acabaram seus créditos</h2>
                <p class="subtitle">Faça um upgrade para continuar usando a Inteligência Artificial</p>
                <button class="close-btn" @click="close">&times;</button>
            </div>

            <div class="modal-body" style="text-align: center;">
                <p class="mb-4">
                    Escolha um plano para continuar usando recursos premium e inteligência artificial.
                </p>
                <button class="btn full-width" @click="goToPlans">
                    Ver Planos e Preços
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const visible = computed(() => authStore.showUpgradeModal);

function close() {
    authStore.showUpgradeModal = false;
}

function goToPlans() {
    close();
    router.push('/plans');
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(28, 26, 23, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 1rem;
}

.modal {
    background: var(--color-bg-card);
    border-radius: 24px;
    width: 100%;
    max-width: 600px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    position: relative;
    animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-header {
    text-align: center;
    padding: 2.5rem 2rem 1rem;
    position: relative;
}

.icon-wrapper {
    font-size: 2rem;
    background: #fef3c7;
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin: 0 auto 1rem;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
}

.modal-header h2 {
    margin: 0 0 0.5rem;
    font-size: 1.75rem;
    color: var(--color-text-main);
}

.subtitle {
    margin: 0;
    color: var(--color-text-muted);
    font-size: 1rem;
}

.close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: transparent;
    border: none;
    font-size: 2rem;
    line-height: 1;
    color: var(--color-text-light);
    cursor: pointer;
    transition: color 0.2s;
}

.close-btn:hover {
    color: var(--color-text-main);
}

.modal-body {
    padding: 1rem 2rem 2.5rem;
    background: var(--color-bg-body);
}

.plans-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: 1rem;
}

@media (min-width: 640px) {
    .plans-grid {
        grid-template-columns: 1fr 1fr;
    }
}

.plan-card {
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 16px;
    padding: 1.5rem;
    text-align: center;
    transition: all 0.2s;
    position: relative;
}

.plan-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
    border-color: var(--color-primary);
}

.plan-card.featured {
    border: 2px solid var(--color-primary);
    background: var(--color-primary-light);
    /* Emerald tint */
}

.badge-popular {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-primary);
    color: white;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 999px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.plan-header h3 {
    margin: 0;
    font-size: 1.25rem;
    color: var(--color-text-main);
}

.price {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-text-main);
    margin: 0.5rem 0 1rem;
}

.features {
    list-style: none;
    padding: 0;
    margin: 0 0 1.5rem;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    font-size: 0.9rem;
    color: var(--color-text-muted);
}

.full-width {
    width: 100%;
}

.footer-note {
    text-align: center;
    font-size: 0.8rem;
    color: var(--color-text-light);
    margin-top: 2rem;
}

@keyframes popIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
