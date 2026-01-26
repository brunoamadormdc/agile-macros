<template>
    <section class="page">
        <div class="header">
            <h1>Calculadora TDEE</h1>
            <p class="subtitle">Descubra seu gasto calórico diário e defina suas metas.</p>
        </div>

        <div class="grid-2 main-grid">
            <!-- Calculator Form -->
            <div class="card">
                <h2>Seus Dados</h2>
                <form @submit.prevent>
                    <div class="form-group">
                        <label class="label">Gênero</label>
                        <div class="radio-group">
                            <label class="radio-card" :class="{ active: form.gender === 'male' }">
                                <input type="radio" v-model="form.gender" value="male">
                                <span>Homem</span>
                            </label>
                            <label class="radio-card" :class="{ active: form.gender === 'female' }">
                                <input type="radio" v-model="form.gender" value="female">
                                <span>Mulher</span>
                            </label>
                        </div>
                    </div>

                    <div class="grid-2">
                        <label class="field">
                            Idade
                            <input type="number" v-model="form.age" placeholder="Anos">
                        </label>
                        <label class="field">
                            Peso (kg)
                            <input type="number" v-model="form.weight" placeholder="kg" step="0.1">
                        </label>
                    </div>

                    <div class="grid-2">
                        <label class="field">
                            Altura (cm)
                            <input type="number" v-model="form.height" placeholder="cm">
                        </label>
                        <label class="field">
                            Gordura Corporal % (Opcional)
                            <input type="number" v-model="form.bodyFat" placeholder="%" step="0.1">
                        </label>
                    </div>

                    <label class="field">
                        Nível de Atividade
                        <select v-model="form.activity">
                            <option value="1.2">Sedentário (Pouco ou nenhum exercício)</option>
                            <option value="1.375">Levemente Ativo (Exercício leve 1-3 dias/sem)</option>
                            <option value="1.55">Moderadamente Ativo (Exercício mod. 3-5 dias/sem)</option>
                            <option value="1.725">Muito Ativo (Exercício pesado 6-7 dias/sem)</option>
                            <option value="1.9">Extremamente Ativo (Treino muito pesado/trabalho físico)</option>
                        </select>
                    </label>
                </form>
            </div>

            <!-- Results & Goal -->
            <div class="stack">
                <div class="card results-card" :class="{ 'has-results': tdee > 0 }">
                    <h2>Resultados</h2>

                    <div v-if="tdee > 0" class="results-content">
                        <div class="stat-row">
                            <span>Taxa Metabólica Basal (BMR)</span>
                            <strong>{{ Math.round(bmr) }} kcal</strong>
                        </div>
                        <div class="stat-row highlight">
                            <span>Gasto Total Diário (TDEE)</span>
                            <strong>{{ Math.round(tdee) }} kcal</strong>
                        </div>

                        <hr class="divider">

                        <h3>Escolha seu Objetivo</h3>
                        <div class="goals-grid" style="grid-template-columns: repeat(2, 1fr);">
                            <button class="goal-btn" :class="{ active: goal === 'deficit_aggressive' }"
                                @click="goal = 'deficit_aggressive'">
                                <span>Deficit Agressivo</span>
                                <small>Perder 1kg/sem (-20%)</small>
                            </button>
                            <button class="goal-btn" :class="{ active: goal === 'deficit_light' }"
                                @click="goal = 'deficit_light'">
                                <span>Deficit Leve</span>
                                <small>Perder 0.5kg/sem (-10%)</small>
                            </button>
                            <button class="goal-btn" :class="{ active: goal === 'maintenance' }"
                                @click="goal = 'maintenance'" style="grid-column: span 2;">
                                <span>Manutenção</span>
                                <small>Manter peso atual</small>
                            </button>
                            <button class="goal-btn" :class="{ active: goal === 'surplus_light' }"
                                @click="goal = 'surplus_light'">
                                <span>Superavit Leve</span>
                                <small>Ganhar 0.25kg/sem (+10%)</small>
                            </button>
                            <button class="goal-btn" :class="{ active: goal === 'surplus_aggressive' }"
                                @click="goal = 'surplus_aggressive'">
                                <span>Superavit Agressivo</span>
                                <small>Ganhar 0.5kg/sem (+20%)</small>
                            </button>
                        </div>

                        <div class="target-display">
                            <p>Meta Diária Sugerida</p>
                            <div class="big-number">{{ Math.round(targetDaily) }} <span>kcal</span></div>
                            <p class="week-total">Meta Semanal: {{ Math.round(targetDaily * 7) }} kcal</p>
                        </div>

                        <hr class="divider">

                        <h3>Distribuição de Macros (g)</h3>
                        <p class="subtitle" style="font-size: 0.8rem; margin-bottom: 1rem;">
                            Personalize os valores abaixo. O app iniciou com uma sugestão base.
                        </p>
                        <div class="macro-inputs">
                            <div class="macro-input-group">
                                <label>Proteína (g)</label>
                                <div class="input-with-result">
                                    <input type="number" v-model.number="customMacros.p">
                                    <span>{{ Math.round(customMacros.p * 4) }} kcal</span>
                                </div>
                            </div>
                            <div class="macro-input-group">
                                <label>Carboidrato (g)</label>
                                <div class="input-with-result">
                                    <input type="number" v-model.number="customMacros.c">
                                    <span>{{ Math.round(customMacros.c * 4) }} kcal</span>
                                </div>
                            </div>
                            <div class="macro-input-group">
                                <label>Gordura (g)</label>
                                <div class="input-with-result">
                                    <input type="number" v-model.number="customMacros.f">
                                    <span>{{ Math.round(customMacros.f * 9) }} kcal</span>
                                </div>
                            </div>
                        </div>

                        <div class="summary-total">
                            <p :class="{ 'text-danger': isOverTarget, 'text-success': !isOverTarget }">
                                Total Calculado: {{ customKcal }} kcal
                            </p>
                            <p v-if="isOverTarget" class="warning-text">
                                ⚠️ Atenção: A soma das macros excede a meta sugerida ({{ Math.round(targetDaily) }}
                                kcal). O déficit pode ser comprometido.
                            </p>
                        </div>

                        <button class="btn full-width primary-action" @click="applyTarget">
                            Salvar Meta no Meu Plano
                        </button>
                    </div>

                    <div v-else class="empty-state">
                        <p>Preencha os dados ao lado para calcular.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const toast = useToast();

const form = ref({
    gender: 'male',
    age: 30,
    weight: 70,
    height: 175,
    bodyFat: null,
    activity: '1.2'
});

const goal = ref('maintenance');

const bmr = computed(() => {
    const { gender, age, weight, height, bodyFat } = form.value;

    if (!weight || !height || !age) return 0;

    // Katch-McArdle if body fat is provided
    if (bodyFat && bodyFat > 0) {
        const lbm = weight * (1 - (bodyFat / 100));
        return 370 + (21.6 * lbm);
    }

    // Mifflin-St Jeor
    const s = gender === 'male' ? 5 : -161;
    return (10 * weight) + (6.25 * height) - (5 * age) + s;
});

const tdee = computed(() => {
    return bmr.value * Number(form.value.activity);
});

const targetDaily = computed(() => {
    if (!tdee.value) return 0;

    switch (goal.value) {
        case 'deficit_aggressive':
            return tdee.value * 0.80; // -20%
        case 'deficit_light':
            return tdee.value * 0.90; // -10%
        case 'surplus_aggressive':
            return tdee.value * 1.20; // +20%
        case 'surplus_light':
            return tdee.value * 1.10; // +10%
        case 'maintenance':
        default:
            return tdee.value;
    }
});

const customMacros = ref({
    p: 0,
    c: 0,
    f: 0
});

// Initialize macros based on default split (40/35/25) when target changes
watch(targetDaily, (newVal) => {
    if (newVal > 0) {
        customMacros.value = {
            p: Math.round((newVal * 0.35) / 4),
            c: Math.round((newVal * 0.40) / 4),
            f: Math.round((newVal * 0.25) / 9)
        };
    }
}, { immediate: true });

const customKcal = computed(() => {
    return Math.round(
        (customMacros.value.p * 4) +
        (customMacros.value.c * 4) +
        (customMacros.value.f * 9)
    );
});

const isOverTarget = computed(() => {
    const diff = customKcal.value - targetDaily.value;
    return diff > 50; // Tolerance of 50kcal
});

async function applyTarget() {
    try {
        await api.post('/api/targets/weekly', {
            strategy: 'daily_macros',
            macros: {
                protein_g: customMacros.value.p,
                carbs_g: customMacros.value.c,
                fat_g: customMacros.value.f
            }
        });
        toast.success('Meta de macros atualizada com sucesso!');
    } catch (err) {
        console.error(err);
        toast.error('Erro ao salvar meta.');
    }
}
</script>

<style scoped>
.header {
    margin-bottom: 2rem;
}

.subtitle {
    color: var(--color-text-muted);
    margin-top: 0.5rem;
}

.main-grid {
    align-items: start;
}

/* Radio Group */
.radio-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.radio-card {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.radio-card:hover {
    background: var(--color-bg-hover);
}

.radio-card.active {
    border-color: var(--color-primary);
    background: var(--color-primary-light);
    color: var(--color-primary);
    font-weight: 600;
}

.radio-card input {
    display: none;
}

/* Divider */
.divider {
    margin: 1.5rem 0;
    border: 0;
    border-top: 1px solid var(--color-border);
}

/* Results Content */
.stat-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: var(--color-text-muted);
}

.stat-row.highlight {
    font-size: 1.1rem;
    color: var(--color-text-main);
    margin-top: 0.5rem;
}

.goals-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
}

.goal-btn {
    background: transparent;
    border: 1px solid var(--color-border);
    padding: 0.75rem 0.5rem;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    transition: all 0.2s;
}

.goal-btn span {
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--color-text-main);
}

.goal-btn small {
    font-size: 0.7rem;
    color: var(--color-text-light);
}

.goal-btn:hover {
    background: var(--color-bg-body);
}

.goal-btn.active {
    background: var(--color-primary);
    border-color: var(--color-primary);
}

.goal-btn.active span {
    color: white;
    /* Force white text when active */
}

.goal-btn.active small {
    color: rgba(255, 255, 255, 0.9);
}

.target-display {
    text-align: center;
    background: var(--color-bg-body);
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 1.5rem;
}

.target-display p {
    margin: 0;
    color: var(--color-text-muted);
    font-size: 0.9rem;
}

.big-number {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--color-primary);
    margin: 0.5rem 0;
    line-height: 1;
}

.big-number span {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text-muted);
}

.week-total {
    font-size: 0.8rem;
    opacity: 0.8;
}

.primary-action {
    font-size: 1rem;
    padding: 1rem;
}

@media (max-width: 768px) {
    .main-grid {
        grid-template-columns: 1fr;
    }
}

.macro-inputs {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
    margin-bottom: 0.5rem;
}

.macro-input-group label {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    margin-bottom: 4px;
    display: block;
}

.input-with-result {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.input-with-result input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    text-align: center;
    background: var(--color-bg-body);
    color: var(--color-text-main);
}

.input-with-result span {
    font-size: 0.8rem;
    color: var(--color-text-main);
    font-weight: 600;
    text-align: center;
}

.summary-total {
    font-size: 0.8rem;
    text-align: right;
    color: var(--color-text-muted);
    margin-bottom: 1.5rem;
}

.text-danger {
    color: var(--color-danger);
    font-weight: 600;
}

.text-success {
    color: var(--color-success) !important;
    font-weight: 600;
}

.warning-text {
    font-size: 0.8rem;
    color: var(--color-warning);
    /* Or similar color */
    margin-top: 0.5rem;
    font-weight: 500;
}
</style>
