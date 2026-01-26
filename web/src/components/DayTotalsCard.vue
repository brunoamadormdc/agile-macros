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

      <div class="macros-stripe">
        <div class="macro-item">
          <span class="macro-label">Proteína</span>
          <span class="macro-val">{{ totals.protein_g?.toFixed(1) || 0 }}g</span>
        </div>
        <div class="macro-divider"></div>
        <div class="macro-item">
          <span class="macro-label">Carboidrato</span>
          <span class="macro-val">{{ totals.carbs_g?.toFixed(1) || 0 }}g</span>
        </div>
        <div class="macro-divider"></div>
        <div class="macro-item">
          <span class="macro-label">Gordura</span>
          <span class="macro-val">{{ totals.fat_g?.toFixed(1) || 0 }}g</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  totals: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
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

.macros-stripe {
  display: flex;
  align-items: center;
  background: var(--color-bg-body);
  /* Changed from fixed #fafaf9 to --color-bg-body for dark support */
  padding: 1rem;
  border-radius: 12px;
  justify-content: space-between;
}

.macro-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.macro-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--color-text-muted);
  letter-spacing: 0.5px;
}

.macro-val {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-main);
}

.macro-divider {
  width: 1px;
  height: 24px;
  background-color: var(--color-border, #e5e5e5);
}
</style>
