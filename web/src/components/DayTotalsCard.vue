<template>
  <section class="card daily-card">
    <div class="card-header">
      <h2>Totais do dia</h2>
    </div>

    <div class="content">
      <div class="main-stat">
        <span class="big-number">{{ totals.kcal?.toFixed(0) || 0 }}</span>
        <span class="unit-label">kcal</span>
      </div>

      <div class="progress-area">
        <div class="progress-bar">
          <div class="progress-fill" :class="{ 'bg-danger pulse': totals.kcal > target }"
            :style="{ width: calcPercent(totals.kcal, target) }"></div>
        </div>
        <div class="remaining-text">
          <span>Meta: {{ Math.round(target) }}</span>
          <span :class="remaining < 0 ? 'text-danger' : 'text-success'">
            {{ remaining >= 0 ? 'Restam: ' : 'Excedeu: ' }} {{ Math.abs(Math.round(remaining)) }}
          </span>
        </div>
      </div>

      <div class="macros-grid">
        <div class="macro-cell">
          <span class="macro-label">Proteína</span>
          <div class="value-wrapper">
            <span class="macro-val">{{ totals.protein_g?.toFixed(1) || 0 }}g</span>
            <span v-if="targetMacros?.protein_g" class="macro-target">
              / {{ Math.round(targetMacros.protein_g) }}g
            </span>
          </div>
          <div class="progress-bar mini">
            <div class="progress-fill"
              :class="{ 'bg-danger pulse': targetMacros?.protein_g > 0 && totals.protein_g > targetMacros.protein_g }"
              :style="{ width: calcPercent(totals.protein_g, targetMacros?.protein_g) }"></div>
          </div>
        </div>

        <div class="macro-cell">
          <span class="macro-label">Carboidrato</span>
          <div class="value-wrapper">
            <span class="macro-val">{{ totals.carbs_g?.toFixed(1) || 0 }}g</span>
            <span v-if="targetMacros?.carbs_g" class="macro-target">
              / {{ Math.round(targetMacros.carbs_g) }}g
            </span>
          </div>
          <div class="progress-bar mini">
            <div class="progress-fill"
              :class="{ 'bg-danger pulse': targetMacros?.carbs_g > 0 && totals.carbs_g > targetMacros.carbs_g }"
              :style="{ width: calcPercent(totals.carbs_g, targetMacros?.carbs_g) }"></div>
          </div>
        </div>

        <div class="macro-cell">
          <span class="macro-label">Gordura</span>
          <div class="value-wrapper">
            <span class="macro-val">{{ totals.fat_g?.toFixed(1) || 0 }}g</span>
            <span v-if="targetMacros?.fat_g" class="macro-target">
              / {{ Math.round(targetMacros.fat_g) }}g
            </span>
          </div>
          <div class="progress-bar mini">
            <div class="progress-fill"
              :class="{ 'bg-danger pulse': targetMacros?.fat_g > 0 && totals.fat_g > targetMacros.fat_g }"
              :style="{ width: calcPercent(totals.fat_g, targetMacros?.fat_g) }"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  totals: {
    type: Object,
    required: true,
  },
  target: {
    type: Number,
    default: 0
  },
  targetMacros: {
    type: Object,
    default: () => ({})
  }
});

const remaining = computed(() => props.target - (props.totals.kcal || 0));

function calcPercent(val, target) {
  if (target <= 0) {
    return (val > 0) ? '100%' : '0%';
  }
  const pct = (val || 0) / target * 100;
  return Math.min(100, pct) + '%';
}
</script>

<style scoped>
.macro-target {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.daily-card {
  display: flex;
  flex-direction: column;
}

.card-header h2 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--color-text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  justify-content: center;
}

.main-stat {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  padding-bottom: 0.5rem;
}

.big-number {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1;
  color: var(--color-text-main);
  letter-spacing: -1px;
}

.unit-label {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.macros-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.75rem;
}

.macro-cell {
  background: var(--color-bg-body);
  padding: 0.75rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.value-wrapper {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.progress-bar.mini {
  height: 3px;
  margin-top: 2px;
}

.progress-area {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.remaining-text {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.text-danger {
  color: var(--color-danger);
}

.text-success {
  color: var(--color-success);
}

.bg-danger {
  background-color: var(--color-danger) !important;
}

.pulse {
  animation: pulse-animation 2s infinite;
}

@keyframes pulse-animation {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.6;
  }

  100% {
    opacity: 1;
  }
}
</style>
