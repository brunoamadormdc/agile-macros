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
      <!-- Summary Row -->
      <div class="summary-grid">
        <div class="summary-card">
          <p class="label">Consumido na semana</p>
          <div class="value-wrapper">
            <div :class="{ 'blur-container': isRestricted }">
              <span class="big-number">{{ totalKcal.toFixed(0) }}</span>
              <span class="unit">kcal</span>
            </div>
            <button v-if="isRestricted" class="lock-btn" @click="openUpgrade">🔒</button>
          </div>
          <p class="sub-text">Média diária: {{ avgKcal.toFixed(0) }} kcal</p>
        </div>

        <div class="summary-card">
          <p class="label">Saldo até agora</p>
          <div class="value-wrapper">
            <div :class="{ 'blur-container': isRestricted }">
              <span class="big-number" :class="balanceKcal >= 0 ? 'text-success' : 'text-danger'">
                {{ formatSigned(balanceKcal) }}
              </span>
              <span class="unit">kcal</span>
            </div>
            <button v-if="isRestricted" class="lock-btn" @click="openUpgrade">🔒</button>
          </div>
          <div class="pill" :class="balanceKcal >= 0 ? 'pill-success' : 'pill-danger'">
            {{ balanceKcal >= 0 ? 'Abaixo / dentro da meta' : 'Acima da meta' }}
          </div>
        </div>

        <div class="summary-card">
          <p class="label">Para fechar a meta</p>
          <div class="value-wrapper">
            <div :class="{ 'blur-container': isRestricted }">
              <span class="medium-number">
                {{ remainingPerDay.toFixed(0) }}
              </span>
              <span class="unit">kcal / dia</span>
            </div>
            <button v-if="isRestricted" class="lock-btn" @click="openUpgrade">🔒</button>
          </div>
          <p class="sub-text">
            Considerando {{ remainingDays }} dia<span v-if="remainingDays !== 1">s</span> restante<span v-if="remainingDays !== 1">s</span>.
          </p>
        </div>
      </div>

      <!-- Projection Section -->
      <div class="projection-section">
        <div class="projection-head">
          <div>
            <p class="eyebrow">Projeção</p>
            <h3>Se manter a média</h3>
          </div>
          <div class="pill ghost">Recalcula automaticamente</div>
        </div>

        <div class="projection-grid">
          <div class="stat-box small">
            <p class="label">Total projetado</p>
            <div class="value-wrapper">
              <div :class="{ 'blur-container': isRestricted }">
                <span class="medium-number">{{ projectedTotal.toFixed(0) }}</span>
                <span class="unit">kcal</span>
              </div>
              <button v-if="isRestricted" class="lock-btn" @click="openUpgrade">🔒</button>
            </div>
          </div>

          <div class="stat-box small">
            <p class="label">Saldo projetado</p>
            <div class="value-wrapper">
              <div :class="{ 'blur-container': isRestricted }">
                <span class="medium-number" :class="projectedBalance >= 0 ? 'text-success' : 'text-danger'">
                  {{ formatSigned(projectedBalance) }}
                </span>
                <span class="unit">kcal</span>
              </div>
              <button v-if="isRestricted" class="lock-btn" @click="openUpgrade">🔒</button>
            </div>
          </div>
        </div>

        <div v-if="remainingDays > 0" class="smart-redistribution">
          <p class="label">Sugestão para ajustar</p>
          <div class="value-wrapper center">
            <span class="big-number highlight">
              {{ Math.max(0, remainingPerDay).toFixed(0) }}
            </span>
            <span class="unit">kcal / dia</span>
          </div>
          <p class="sub-text">Consuma cerca disso nos próximos dias para ficar na meta.</p>
        </div>
      </div>

      <!-- Weekly Macro Targets -->
      <div class="macro-targets">
        <div class="divider"></div>
        <div class="macro-head">
          <h3>Macros médios x meta</h3>
          <span class="muted">Valores diários médios na semana</span>
        </div>
        <div class="macros-grid">
          <div class="macro-cell" v-for="macro in macroList" :key="macro.key">
            <div class="macro-top">
              <span class="label">{{ macro.label }}</span>
              <span class="macro-target">{{ macro.targetLabel }}</span>
            </div>
            <div class="value-wrapper small">
              <span :class="{ 'blur-text': isRestricted }">
                {{ macro.value.toFixed(0) }}g
              </span>
              <button v-if="isRestricted" class="lock-btn mini" @click="openUpgrade">🔒</button>
            </div>
            <div class="progress-bar mini">
              <div class="progress-fill" :class="macro.barClass" :style="{ width: macro.percent }"></div>
            </div>
            <div class="macro-bottom">
              <span class="macro-status" :class="macro.statusClass">{{ macro.statusText }}</span>
              <span class="macro-diff" :class="macro.diffClass">{{ macro.diffText }}</span>
            </div>
          </div>
        </div>

        <div v-if="showKcalWarning" class="macro-warning">
          ⚠️ Meta calórica semanal já estourou; completar macros faltantes pode piorar o saldo de kcal.
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

const totalKcal = computed(() => props.weekSummary.weekTotal?.kcal ?? 0);
const avgKcal = computed(() => totalKcal.value / 7);
const balanceKcal = computed(() => props.weekSummary.balance?.kcal ?? 0);
const projectedTotal = computed(() => props.weekSummary.projection?.projectedWeekKcal ?? 0);
const projectedBalance = computed(() => props.weekSummary.projection?.projectedBalanceKcal ?? 0);
const remainingDays = computed(() => props.weekSummary.projection?.remainingDays ?? 0);
const remainingPerDay = computed(() => {
  if (!remainingDays.value) return 0;
  const val = (props.weekSummary.balance?.kcal ?? 0) / remainingDays.value * -1;
  return Math.max(0, val);
});

const showKcalWarning = computed(() =>
  (props.weekSummary.balance?.kcal ?? 0) < 0 &&
  macroList.value.some((m) => m.statusClass === 'tag-faltando')
);
const macroList = computed(() => {
  const target = props.weekSummary.targetWeek || {};
  const totals = props.weekSummary.weekTotal || {};
  const avg = {
    protein_g: (totals.protein_g || 0) / 7,
    carbs_g: (totals.carbs_g || 0) / 7,
    fat_g: (totals.fat_g || 0) / 7,
  };
  const map = [
    { key: 'protein_g', label: 'Proteína', target: target.protein_g },
    { key: 'carbs_g', label: 'Carbo', target: target.carbs_g },
    { key: 'fat_g', label: 'Gordura', target: target.fat_g },
  ];

  return map.map((m) => {
    const value = avg[m.key] || 0;
    const tgt = (m.target || 0) / 7; // usar meta diária para comparar com média diária
    const pct = tgt ? Math.min(120, (value / tgt) * 100) : 0;
    const status =
      !tgt ? 'sem-meta'
        : pct < 95 ? 'faltando'           // margem de folga pequena
          : pct <= 102 ? 'ok'             // até ~2% consideramos dentro
            : 'excedeu';
    const statusText = {
      'sem-meta': 'Defina meta',
      'faltando': 'Abaixo da meta',
      'ok': 'Dentro da meta',
      'excedeu': 'Acima da meta'
    }[status];
    const barClass = status === 'excedeu' ? 'bar-danger' : status === 'faltando' ? 'bar-warn' : 'bar-ok';
    const diff = value - tgt;
    const diffText = !tgt ? '' : diff >= 0 ? `+${diff.toFixed(0)}g` : `${diff.toFixed(0)}g`;
    const diffClass = diff === 0 ? '' : diff > 0 ? 'text-danger' : 'text-warning';
    return {
      key: m.key,
      label: m.label,
      value,
      percent: `${pct}%`,
      targetLabel: tgt ? `Meta/dia: ${tgt.toFixed(0)}g` : 'Meta não definida',
      statusText,
      statusClass: `tag-${status}`,
      barClass,
      diffText,
      diffClass,
    };
  });
});

function openUpgrade() {
  authStore.showUpgradeModal = true;
}

function calcPercent(val, target) {
  if (!target) return '0%';
  const pct = (val || 0) / target * 100;
  return Math.min(100, pct) + '%';
}

function formatSigned(v) {
  const n = Number(v || 0).toFixed(0);
  return v > 0 ? `+${n}` : n;
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

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.summary-card {
  background: var(--color-bg-body);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
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

.pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 700;
  width: fit-content;
}

.pill-success {
  background: var(--color-success-bg);
  color: var(--color-success);
}

.pill-danger {
  background: var(--color-danger-bg);
  color: var(--color-danger);
}

.pill.ghost {
  background: var(--color-bg-body);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
}

.projection-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.projection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
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
  background: var(--color-bg-card);
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
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem;
}

.macro-cell {
  background: var(--color-bg-body);
  padding: 1rem;
  border-radius: 8px;
}

.macro-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.macro-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.macro-target {
  font-size: 0.75rem;
  color: var(--color-text-light);
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

.bar-ok {
  background: var(--color-primary);
}

.bar-warn {
  background: var(--color-warning);
}

.bar-danger {
  background: var(--color-danger);
}

.macro-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.35rem;
}

.macro-status {
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid transparent;
}

.tag-ok {
  background: var(--color-success-bg);
  color: var(--color-success);
}

.tag-faltando {
  background: var(--color-warning-bg);
  color: var(--color-warning);
}

.tag-excedeu {
  background: var(--color-danger-bg);
  color: var(--color-danger);
}

.tag-sem-meta {
  background: var(--color-bg-body);
  color: var(--color-text-muted);
  border-color: var(--color-border);
}

.macro-diff {
  font-size: 0.8rem;
  color: var(--color-text-light);
}

.macro-warning {
  margin: 0.75rem 0 0.25rem;
  padding: 0.85rem 1rem;
  border-radius: var(--radius-md);
  background: var(--color-warning-bg);
  color: var(--color-warning);
  border: 1px solid rgba(245, 158, 11, 0.3);
  font-weight: 600;
}

.macros-grid {
  margin-top: 0.75rem;
  margin-bottom: 0.35rem;
}
</style>
