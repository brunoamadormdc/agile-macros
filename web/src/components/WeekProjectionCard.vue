<template>
  <section class="card week-card">
    <div class="card-header">
      <div class="header-left">
        <h2>Semana</h2>
        <span class="week-range">{{ weekRange }}</span>
      </div>
      <span :class="['badge', weekSummary.status === 'over' ? 'badge-danger' : 'badge-success']">
        {{ weekSummary.status === 'over' ? 'Acima da meta' : 'Dentro da meta' }}
      </span>
    </div>

    <div class="content">
      <!-- Real Data Row -->
      <div class="stats-row">
        <div class="stat-box">
          <p class="label">Consumido</p>
          <div class="value-wrapper">
            <div :class="{ 'blur-container': isRestricted }">
              <span class="big-number">{{ (weekSummary.weekTotal?.kcal ?? 0).toFixed(0) }}</span>
              <span class="unit">kcal</span>
            </div>
            <button v-if="isRestricted" class="lock-btn" @click="openUpgrade">🔒</button>
          </div>
          <p class="sub-text">Média: {{ ((weekSummary.weekTotal?.kcal ?? 0) / 7).toFixed(0) }}</p>
        </div>

        <div class="stat-box">
          <p class="label">Saldo da Semana</p>
          <div class="value-wrapper">
            <div :class="{ 'blur-container': isRestricted }">
              <span class="big-number">{{ (weekSummary.balance?.kcal ?? 0).toFixed(0) }}</span>
              <span class="unit">kcal</span>
            </div>
            <button v-if="isRestricted" class="lock-btn" @click="openUpgrade">🔒</button>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Projection Section -->
      <div class="projection-section">
        <h3>Projeção (se mantiver a média)</h3>
        <div class="stats-row">
          <div class="stat-box small">
            <p class="label">Total Projetado</p>
            <div class="value-wrapper">
              <div :class="{ 'blur-container': isRestricted }">
                <span class="medium-number">{{ (weekSummary.projection?.projectedWeekKcal ?? 0).toFixed(0) }}</span>
                <span class="unit">kcal</span>
              </div>
              <button v-if="isRestricted" class="lock-btn" @click="openUpgrade">🔒</button>
            </div>
          </div>

          <div class="stat-box small">
            <p class="label">Saldo Projetado</p>
            <div class="value-wrapper">
              <div :class="{ 'blur-container': isRestricted }">
                <span class="medium-number" :class="{
                  'text-success': (weekSummary.projection?.projectedBalanceKcal ?? 0) >= 0,
                  'text-danger': (weekSummary.projection?.projectedBalanceKcal ?? 0) < 0
                }">
                  {{ (weekSummary.projection?.projectedBalanceKcal ?? 0).toFixed(0) }}
                </span>
                <span class="unit">kcal</span>
              </div>
              <button v-if="isRestricted" class="lock-btn" @click="openUpgrade">🔒</button>
            </div>
          </div>
        </div>

        <!-- Smart Redistribution Highlight -->
        <div v-if="weekSummary.projection?.remainingDays > 0" class="smart-redistribution">
          <div class="divider"></div>
          <p class="label">Sugestão Inteligente ({{ weekSummary.projection.remainingDays }} dias restantes)</p>
          <div class="value-wrapper center">
            <span class="big-number highlight">
              {{ Math.max(0, (weekSummary.balance?.kcal ?? 0) / weekSummary.projection.remainingDays).toFixed(0) }}
            </span>
            <span class="unit">kcal / dia</span>
          </div>
          <p class="sub-text">Para fechar a semana na meta exata.</p>
        </div>
      </div>

      <!-- Weekly Macro Targets (If Active) -->
      <div class="macro-targets">
        <div class="divider"></div>
        <h3>Metas de Macros</h3>
        <!-- Simplified Macro Display -->
        <div class="macros-grid">
          <!-- Protein -->
          <div class="macro-cell">
            <span class="label">Prot (média)</span>
            <div class="value-wrapper small">
              <span :class="{ 'blur-text': isRestricted }">
                {{ ((weekSummary.weekTotal?.protein_g ?? 0) / 7).toFixed(0) }}g
              </span>
              <button v-if="isRestricted" class="lock-btn mini" @click="openUpgrade">🔒</button>
            </div>
            <div class="progress-bar mini">
              <div class="progress-fill"
                :style="{ width: calcPercent(weekSummary.weekTotal?.protein_g, weekSummary.targetWeek?.protein_g) }">
              </div>
            </div>
          </div>

          <!-- Carbs -->
          <div class="macro-cell">
            <span class="label">Carb (média)</span>
            <div class="value-wrapper small">
              <span :class="{ 'blur-text': isRestricted }">
                {{ ((weekSummary.weekTotal?.carbs_g ?? 0) / 7).toFixed(0) }}g
              </span>
              <button v-if="isRestricted" class="lock-btn mini" @click="openUpgrade">🔒</button>
            </div>
            <div class="progress-bar mini">
              <div class="progress-fill"
                :style="{ width: calcPercent(weekSummary.weekTotal?.carbs_g, weekSummary.targetWeek?.carbs_g) }"></div>
            </div>
          </div>

          <!-- Fat -->
          <div class="macro-cell">
            <span class="label">Gord (média)</span>
            <div class="value-wrapper small">
              <span :class="{ 'blur-text': isRestricted }">
                {{ ((weekSummary.weekTotal?.fat_g ?? 0) / 7).toFixed(0) }}g
              </span>
              <button v-if="isRestricted" class="lock-btn mini" @click="openUpgrade">🔒</button>
            </div>
            <div class="progress-bar mini">
              <div class="progress-fill"
                :style="{ width: calcPercent(weekSummary.weekTotal?.fat_g, weekSummary.targetWeek?.fat_g) }"></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';

const props = defineProps({
  weekSummary: {
    type: Object,
    required: true,
  },
});

const authStore = useAuthStore();

const weekRange = computed(() => {
  const start = props.weekSummary.days?.[0]?.date;
  const end = props.weekSummary.days?.[6]?.date;
  if (!start || !end) return '';
  const fmt = (d) => {
    const [y, m, da] = d.split('-');
    return `${da}/${m}`;
  };
  return `${fmt(start)} - ${fmt(end)}`;
});

const isRestricted = computed(() => {
  return authStore.user?.plan === 'free' && authStore.credits <= 0;
});

function openUpgrade() {
  authStore.showUpgradeModal = true;
}

function calcPercent(val, target) {
  if (!target) return '0%';
  const pct = (val || 0) / target * 100;
  return Math.min(100, pct) + '%';
}
</script>

<style scoped>
.week-card {
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.week-range {
  font-size: 0.8rem;
  color: var(--color-text-light);
  font-weight: 500;
}

.card-header h2 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--color-text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.badge-success {
  background: var(--color-success-bg);
  color: var(--color-success);
}

.badge-danger {
  background: var(--color-danger-bg);
  color: var(--color-danger);
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stats-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.stat-box {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-bottom: 4px;
}

.value-wrapper {
  display: flex;
  align-items: baseline;
  gap: 4px;
  position: relative;
  width: fit-content;
}

.big-number {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-text-main);
  line-height: 1;
}

.medium-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-main);
  line-height: 1;
}

.unit {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.sub-text {
  font-size: 0.75rem;
  color: var(--color-text-light);
  margin-top: 4px;
}

.divider {
  height: 1px;
  background: var(--color-border);
  width: 100%;
}

.projection-section h3 {
  font-size: 0.9rem;
  color: var(--color-text-light);
  font-weight: 600;
  margin: 0 0 1rem;
}

.text-success {
  color: var(--color-success);
}

.text-danger {
  color: var(--color-danger);
}

/* Lock & Blur Logic */
.blur-container {
  filter: blur(6px);
  opacity: 0.6;
  user-select: none;
}

.blur-text {
  filter: blur(4px);
  opacity: 0.6;
}

.lock-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 0.75rem;
  z-index: 10;
  padding: 0;
}

.lock-btn:hover {
  background: var(--color-bg-body);
}

.lock-btn.mini {
  width: 16px;
  height: 16px;
  font-size: 0.6rem;
}

/* Macros Grid */
.macros-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}

.macro-cell {
  background: var(--color-bg-body);
  padding: 0.75rem;
  border-radius: 8px;
}

.value-wrapper.small {
  font-size: 0.9rem;
  font-weight: 700;
  margin: 4px 0;
}

.progress-bar {
  height: 4px;
  background: var(--color-border);
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

.progress-bar.mini {
  height: 3px;
}

.smart-redistribution {
  margin-top: 1rem;
  text-align: center;
}

.value-wrapper.center {
  justify-content: center;
  margin-top: 0.5rem;
}

.big-number.highlight {
  color: var(--color-primary);
  font-size: 2.25rem;
}

.progress-fill {
  background: var(--color-primary);
  height: 100%;
  border-radius: 2px;
}
</style>
