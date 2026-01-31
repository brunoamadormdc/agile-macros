<template>
    <section class="page plans-page">
        <div class="header-center">
            <h1>Escolha seu Plano</h1>
            <p class="subtitle">Desbloqueie todo o potencial da sua dieta com Inteligência Artificial</p>
        </div>

        <div class="plans-container">
            <!-- Free Plan -->
            <div class="plan-card" :class="{ 'current-plan': currentPlan === 'free' }">
                <div class="plan-header">
                    <h3>Free</h3>
                    <div class="price-block">
                        <span class="currency">R$</span>
                        <span class="amount">0</span>
                        <span class="period">/mês</span>
                    </div>
                    <p class="desc">Para testar e começar</p>
                </div>

                <ul class="features-list">
                    <li>
                        <span class="check">✓</span>
                        <span><strong>10 créditos</strong> de IA (Degustação)</span>
                    </li>
                    <li>
                        <span class="check">✓</span>
                        <span>Diário Manual Ilimitado</span>
                    </li>
                    <li>
                        <span class="check">✓</span>
                        <span>Acesso à Calculadora TDEE</span>
                    </li>
                    <li>
                        <span class="check">✓</span>
                        <span>Saldo Semanal</span>
                    </li>
                </ul>

                <button class="btn full-width" :class="currentPlan === 'free' ? 'ghost' : ''" @click="selectFreePlan"
                    :disabled="currentPlan === 'free'">
                    {{ currentPlan === 'free' ? 'Seu plano atual' : 'Começar Grátis' }}
                </button>
            </div>

            <!-- Plus Plan (Featured / Unlimited) -->
            <div class="plan-card featured" :class="{ 'current-plan': currentPlan === 'plus' }">
                <div class="badge-popular">Melhor Valor</div>
                <div class="plan-header">
                    <h3>Plus</h3>
                    <div class="price-block">
                        <span class="currency">R$</span>
                        <span class="amount">49,90</span>
                        <span class="period">/mês</span>
                    </div>
                    <p class="desc">Liberdade total com IA Ilimitada</p>
                </div>

                <ul class="features-list">
                    <li>
                        <span class="check">✓</span>
                        <span>
                            <strong>Créditos ILIMITADOS</strong> de IA
                            <span style="display: block; font-size: 0.75rem; color: var(--color-text-muted); margin-top: 2px;">
                                (Limite de uso justo: 50 requests/dia)
                            </span>
                        </span>
                    </li>
                    <li>
                        <span class="check">✓</span>
                        <span>Histórico <strong>Infinito</strong></span>
                    </li>
                    <li>
                        <span class="check">✓</span>
                        <span>Evolução Avançada e Metas</span>
                    </li>
                    <li>
                        <span class="check">✓</span>
                        <span>Suporte VIP e Acesso Antecipado</span>
                    </li>
                </ul>

                <button class="btn full-width" :class="currentPlan === 'plus' ? 'ghost' : 'btn-primary'"
                    @click="selectPlan('plus')">
                    {{ currentPlan === 'plus' ? 'Gerenciar Assinatura' : 'Assinar Plus' }}
                </button>
            </div>
        </div>
        <!-- Contact Modal with Lead Form -->
        <div v-if="showContactModal" class="modal-overlay" @click.self="closeContactModal">
            <div class="modal">
                <div class="modal-header">
                    <h2>Interesse no Plano {{ selectedPlanName }}</h2>
                    <button class="close-btn" @click="closeContactModal">&times;</button>
                </div>

                <div class="modal-body">
                    <p class="text-center mb-4">
                        Estamos em fase beta fechada. Preencha seus dados que entraremos em contato.
                    </p>

                    <form @submit.prevent="submitLead" class="lead-form">
                        <div class="form-group">
                            <label for="name">Nome Completo</label>
                            <input type="text" id="name" v-model="form.name" required placeholder="Seu nome" />
                        </div>

                        <div class="form-group">
                            <label for="email">E-mail</label>
                            <input type="email" id="email" v-model="form.email" required placeholder="seu@email.com" />
                        </div>

                        <div class="form-group">
                            <label for="phone">WhatsApp</label>
                            <input type="tel" id="phone" v-model="form.phone" required placeholder="(11) 99999-9999" />
                        </div>

                        <div class="form-group">
                            <label for="obs">Observações (Opcional)</label>
                            <textarea id="obs" v-model="form.observation" rows="3"
                                placeholder="Algo que queira nos contar?"></textarea>
                        </div>

                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary full-width" :disabled="loading">
                                {{ loading ? 'Enviando...' : 'Enviar Interesse' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';
import { useToast } from 'vue-toastification';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const currentPlan = computed(() => authStore.user?.plan);

function selectFreePlan() {
    router.push('/register');
}

const showContactModal = ref(false);
const selectedPlan = ref('');
const loading = ref(false);

const form = reactive({
    name: '',
    email: '',
    phone: '',
    observation: ''
});

const selectedPlanName = computed(() => {
    return selectedPlan.value ? selectedPlan.value.charAt(0).toUpperCase() + selectedPlan.value.slice(1) : '';
});

async function selectPlan(plan) {
    if (plan === 'plus') {
        if (currentPlan.value === 'plus') {
            await authStore.manageSubscription();
        } else {
            await authStore.subscribeToPlus();
        }
        return;
    }
    
    // Legacy/Fallback for other plans if any
    selectedPlan.value = plan;
    // Pre-fill email if available
    if (authStore.user?.email) {
        form.email = authStore.user.email;
    }
    showContactModal.value = true;
}

function closeContactModal() {
    showContactModal.value = false;
    selectedPlan.value = '';
    // Optional: Reset form or just leave it for next time
    // form.name = '';
    // form.phone = '';
    // form.observation = '';
}

async function submitLead() {
    if (!selectedPlan.value) return;

    loading.value = true;
    try {
        await api.post('/leads', {
            name: form.name,
            email: form.email,
            phone: form.phone,
            observation: form.observation,
            planOfInterest: selectedPlan.value
        });

        toast.success('Interesse registrado! Entraremos em contato em breve.');
        closeContactModal();
    } catch (error) {
        console.error(error);
        toast.error('Erro ao enviar dados. Tente novamente.');
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.header-center {
    text-align: center;
    margin-bottom: 2.5rem;
}

.subtitle {
    color: var(--color-text-muted);
    font-size: 1.1rem;
    margin-top: 0.5rem;
}

.plans-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    align-items: start;
}

.plan-card {
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 24px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    position: relative;
}

.plan-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.1));
}

.plan-card.featured {
    border: 2px solid var(--color-primary);
    background: linear-gradient(to bottom, #f0fdf4 0%, #ffffff 100%);
    transform: scale(1.05);
    /* Slightly bigger */
    z-index: 2;
}

/* Dark mode specific override via :root ancestor or media query if possible 
   Since this is scoped CSS, we rely on the global class on :root/body 
*/
:root.dark-mode .plan-card.featured {
    background: linear-gradient(to bottom, #064e3b 0%, var(--color-bg-card) 100%);
}

.plan-card.featured:hover {
    transform: scale(1.05) translateY(-4px);
}

.plan-card.pro-card {
    border-color: #f59e0b;
    /* Amber */
    background: linear-gradient(to bottom, #fffbeb 0%, #ffffff 100%);
}

.badge-popular {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-primary);
    color: white;
    font-size: 0.8rem;
    font-weight: 700;
    padding: 4px 16px;
    border-radius: 999px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);
}

.plan-header {
    text-align: center;
    margin-bottom: 2rem;
}

.plan-header h3 {
    font-size: 1.5rem;
    margin: 0;
    color: var(--color-text-main);
}

.price-block {
    margin: 1rem 0;
    display: flex;
    align-items: baseline;
    justify-content: center;
    color: var(--color-text-main);
}

.currency {
    font-size: 1.25rem;
    font-weight: 500;
    margin-right: 2px;
}

.amount {
    font-size: 3rem;
    font-weight: 800;
    line-height: 1;
}

.period {
    font-size: 1rem;
    color: var(--color-text-muted);
    margin-left: 4px;
}

.desc {
    color: var(--color-text-muted);
    font-size: 0.95rem;
    margin: 0;
}

.features-list {
    list-style: none;
    padding: 0;
    margin: 0 0 2rem;
    flex: 1;
}

.features-list li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 1rem;
    color: var(--color-text-main);
    font-size: 0.95rem;
    line-height: 1.4;
}

.check {
    color: var(--color-primary);
    font-weight: 800;
    font-size: 1.1rem;
}

.btn-primary {
    background: var(--color-primary);
    color: white;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

@media (max-width: 900px) {
    .plan-card.featured {
        transform: none;
        order: -1;
    }

    .plan-card.featured:hover {
        transform: translateY(-4px);
    }
}

/* Modal Styles */
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
    max-width: 500px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
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

.modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--color-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h2 {
    font-size: 1.25rem;
    margin: 0;
    color: var(--color-text-main);
}

.close-btn {
    background: none;
    border: none;
    font-size: 2rem;
    line-height: 1;
    color: var(--color-text-muted);
    cursor: pointer;
    padding: 0;
}

.modal-body {
    padding: 2rem;
    color: var(--color-text-main);
}

.text-center {
    text-align: center;
}

.mb-4 {
    margin-bottom: 1.5rem;
}

/* Form Styles */
.lead-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group label {
    font-weight: 500;
    font-size: 0.9rem;
    color: var(--color-text-main);
}

.form-group input,
.form-group textarea {
    padding: 0.75rem 1rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: 1rem;
    transition: border-color 0.2s;
    font-family: var(--font-sans);
    background: var(--color-bg-card);
    color: var(--color-text-main);
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-light);
}

.form-actions {
    margin-top: 1rem;
}
</style>
