<template>
    <section class="page plans-page">
        <div class="header-center">
            <h1>Versao Free em Lancamento</h1>
            <p class="subtitle">Recursos pagos serão avaliados após esta primeira fase.</p>
        </div>

        <div class="plans-container">
            <div class="plan-card current-plan">
                <div class="plan-header">
                    <h3>Plano Atual</h3>
                    <div class="price-block">
                        <span class="currency">R$</span>
                        <span class="amount">0</span>
                        <span class="period">/mes</span>
                    </div>
                    <p class="desc">Lancamento inicial com foco no diario manual.</p>
                </div>

                <ul class="features-list">
                    <li><span class="check">✓</span><span>Diario manual ilimitado</span></li>
                    <li><span class="check">✓</span><span>Busca de alimentos</span></li>
                    <li><span class="check">✓</span><span>Saldo semanal e metas</span></li>
                    <li><span class="check">✓</span><span>Copia de refeicoes liberada</span></li>
                    <li><span class="check">✓</span><span>Calculadora TDEE</span></li>
                </ul>

                <button class="btn full-width ghost" @click="goToDiary">
                    Voltar para o diario
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goToDiary() {
    router.push('/today');
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
    grid-template-columns: minmax(0, 560px);
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    justify-content: center;
}

.plan-card {
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 24px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.current-plan {
    border-color: var(--color-primary);
    box-shadow: var(--shadow-md);
}

.plan-header {
    text-align: center;
}

.plan-header h3 {
    margin-bottom: 1rem;
}

.price-block {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 0.25rem;
    margin-bottom: 0.75rem;
}

.currency {
    font-size: 1.2rem;
    color: var(--color-text-muted);
}

.amount {
    font-size: 3rem;
    font-weight: 800;
    line-height: 1;
}

.period,
.desc {
    color: var(--color-text-muted);
}

.features-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
}

.features-list li {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
}

.check {
    color: var(--color-primary);
    font-weight: 700;
}

.full-width {
    width: 100%;
}

@media (max-width: 640px) {
    .header-center {
        margin-bottom: 1.5rem;
    }

    .subtitle {
        font-size: 1rem;
    }

    .plan-card {
        padding: 1.25rem;
        border-radius: var(--radius-lg);
        gap: 1rem;
    }

    .amount {
        font-size: 2.5rem;
    }

    .features-list {
        gap: 0.75rem;
    }
}
</style>
