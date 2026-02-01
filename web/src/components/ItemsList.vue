<template>
  <section class="card">
    <h2>Itens do dia</h2>
    <div v-if="!items.length" class="empty-state">
      <p>Nenhum item hoje.</p>
      <p class="muted">Adicione algo para comecar.</p>
    </div>
    <div v-else class="meal-groups">
      <div v-for="mealKey in mealOrder" :key="mealKey">
        <div v-if="groupedItems[mealKey].length > 0" class="meal-group">
          <div class="meal-header">
            <div class="meal-title">
              <h3>{{ mealLabels[mealKey] }}</h3>
              <span class="meal-count">{{ groupedItems[mealKey].length }} item<span v-if="groupedItems[mealKey].length > 1">s</span></span>
            </div>
            <div class="meal-totals">
              <span class="macro-chip kcal">
                <strong>{{ mealTotals[mealKey].kcal.toFixed(0) }}</strong>
                <small>kcal</small>
              </span>
              <span class="macro-chip">
                <strong>{{ mealTotals[mealKey].protein_g.toFixed(0) }}g</strong>
                <small>Prot</small>
              </span>
              <span class="macro-chip">
                <strong>{{ mealTotals[mealKey].carbs_g.toFixed(0) }}g</strong>
                <small>Carb</small>
              </span>
              <span class="macro-chip">
                <strong>{{ mealTotals[mealKey].fat_g.toFixed(0) }}g</strong>
                <small>Gord</small>
              </span>
            </div>
          </div>

          <ul class="items-list">
            <li v-for="item in groupedItems[mealKey]" :key="item.originalIndex" class="food-card">
              <div v-if="editingIndex !== item.originalIndex" class="food-card-body">
                <div class="item-info">
                  <p class="item-title">{{ item.label }}</p>
                  <p class="muted item-qty">
                    {{ item.qty }} {{ item.unit }}
                  </p>
                </div>

                <div class="item-meta">
                  <div class="macro-badges">
                    <span class="macro-chip kcal">
                      <strong>{{ item.kcal.toFixed(0) }}</strong>
                      <small>kcal</small>
                    </span>
                    <span class="macro-chip">
                      <strong>{{ item.protein_g.toFixed(0) }}g</strong>
                      <small>P</small>
                    </span>
                    <span class="macro-chip">
                      <strong>{{ item.carbs_g.toFixed(0) }}g</strong>
                      <small>C</small>
                    </span>
                    <span class="macro-chip">
                      <strong>{{ item.fat_g.toFixed(0) }}g</strong>
                      <small>G</small>
                    </span>
                  </div>

                  <div class="item-actions">
                    <button class="btn-icon" title="Editar" aria-label="Editar item"
                      @click="startEdit(item, item.originalIndex)">✎</button>
                    <button class="btn-icon" title="Duplicar" aria-label="Duplicar item"
                      @click="$emit('duplicate', item)">⧉</button>
                    <button class="btn-icon danger" title="Remover" aria-label="Remover item"
                      @click="$emit('remove', item.originalIndex)">✕</button>
                  </div>
                </div>
              </div>

              <!-- Edit Form -->
              <div v-else class="edit-form">
                <label class="field" style="margin-bottom: 0.5rem;">
                  Descricao
                  <input v-model="editForm.label" type="text" />
                </label>

                <div class="grid-2" style="grid-template-columns: 1fr 1fr; margin-bottom: 0.5rem;">
                  <label class="field">
                    Qtd
                    <input v-model.number="editForm.qty" type="number" min="0" step="0.1" @input="onQtyChange" />
                  </label>
                  <label class="field">
                    Un
                    <input v-model="editForm.unit" type="text" />
                  </label>
                </div>

                <label class="field" style="margin-bottom: 0.5rem;">
                  Refeição
                  <select v-model="editForm.meal" class="input-select">
                    <option v-for="(label, key) in mealLabels" :key="key" :value="key">{{ label }}</option>
                  </select>
                </label>

                <div class="grid-4-mini" style="margin-bottom: 1rem;">
                  <label class="field">
                    Kcal
                    <input v-model.number="editForm.macros.kcal" type="number" min="0" step="0.1" />
                  </label>
                  <label class="field">
                    P (g)
                    <input v-model.number="editForm.macros.protein_g" type="number" min="0" step="0.1" />
                  </label>
                  <label class="field">
                    C (g)
                    <input v-model.number="editForm.macros.carbs_g" type="number" min="0" step="0.1" />
                  </label>
                  <label class="field">
                    G (g)
                    <input v-model.number="editForm.macros.fat_g" type="number" min="0" step="0.1" />
                  </label>
                </div>

                <div class="edit-actions">
                  <button class="btn ghost small" type="button" @click="cancelEdit">Cancelar</button>
                  <button class="btn small" type="button" @click="saveEdit(item.originalIndex)">Salvar</button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['remove', 'update', 'duplicate']);

const mealOrder = ['breakfast', 'lunch', 'snack', 'dinner', 'supper', 'other'];
const mealLabels = {
  breakfast: '☕ Café da Manhã',
  lunch: '🍽️ Almoço',
  snack: '🍎 Lanche',
  dinner: '🍲 Jantar',
  supper: '🌙 Ceia',
  other: '🤔 Outros'
};

const groupedItems = computed(() => {
  const groups = {
    breakfast: [],
    lunch: [],
    snack: [],
    dinner: [],
    supper: [],
    other: []
  };
  props.items.forEach((item, index) => {
    const meal = item.meal || 'other';
    const target = groups[meal] || groups.other;
    target.push({ ...item, originalIndex: index });
  });
  return groups;
});

const mealTotals = computed(() => {
  const totals = {};
  mealOrder.forEach((meal) => {
    totals[meal] = getGroupTotals(groupedItems.value[meal]);
  });
  return totals;
});

function getGroupTotals(groupItems) {
  return groupItems.reduce((acc, item) => ({
    kcal: acc.kcal + item.kcal,
    protein_g: acc.protein_g + item.protein_g,
    carbs_g: acc.carbs_g + item.carbs_g,
    fat_g: acc.fat_g + item.fat_g,
  }), { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 });
}

const editingIndex = ref(null);
const editForm = ref({
  label: '',
  qty: 1,
  unit: '',
  meal: 'other',
  macros: { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 },
});

const baseRatios = ref({ kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 });

function startEdit(item, index) {
  editingIndex.value = index;
  editForm.value = {
    label: item.label,
    qty: item.qty,
    unit: item.unit,
    meal: item.meal || 'other',
    macros: {
      kcal: item.kcal,
      protein_g: item.protein_g,
      carbs_g: item.carbs_g,
      fat_g: item.fat_g,
    },
  };

  const q = item.qty || 1;
  baseRatios.value = {
    kcal: item.kcal / q,
    protein_g: item.protein_g / q,
    carbs_g: item.carbs_g / q,
    fat_g: item.fat_g / q,
  };
}

function onQtyChange() {
  const newQty = editForm.value.qty;
  if (typeof newQty !== 'number') return;

  editForm.value.macros.kcal = Number((baseRatios.value.kcal * newQty).toFixed(1));
  editForm.value.macros.protein_g = Number((baseRatios.value.protein_g * newQty).toFixed(1));
  editForm.value.macros.carbs_g = Number((baseRatios.value.carbs_g * newQty).toFixed(1));
  editForm.value.macros.fat_g = Number((baseRatios.value.fat_g * newQty).toFixed(1));
}

function cancelEdit() {
  editingIndex.value = null;
}

function saveEdit(index) {
  emit('update', index, editForm.value);
  editingIndex.value = null;
}
</script>

<style scoped>
.meal-group {
  margin-bottom: 2rem;
}

.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--color-border);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.meal-header h3 {
  font-size: 1.1rem;
  color: var(--color-primary);
  margin: 0;
}

.meal-title {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.meal-count {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.meal-totals {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.macro-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.4rem 0.65rem;
  background: var(--color-bg-body);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  color: var(--color-text-main);
  font-size: 0.8rem;
  min-width: 62px;
  justify-content: center;
}

.macro-chip small {
  color: var(--color-text-muted);
}

.macro-chip strong {
  font-weight: 700;
  letter-spacing: -0.01em;
}

.macro-chip.kcal {
  background: var(--color-primary-light);
  border-color: transparent;
  color: var(--color-primary-dark);
}

.items-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 1rem;
}

.food-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-body);
  padding: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.food-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-md);
}

.food-card-body {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-title {
  margin: 0;
  font-weight: 700;
  font-size: 1.02rem;
  line-height: 1.3;
  color: var(--color-text-main);
}

.item-qty {
  margin: 0.25rem 0 0;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.macro-badges {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.item-actions {
  display: inline-flex;
  gap: 0.35rem;
  opacity: 0.9;
  transition: opacity 0.2s;
}

.food-card:hover .item-actions {
  opacity: 1;
}

.btn-icon {
  border: 1px solid var(--color-border);
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  padding: 6px;
  border-radius: var(--radius-full);
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  min-width: 36px;
  transition: all 0.15s ease;
}

.btn-icon:hover {
  background: var(--color-bg-card);
  border-color: var(--color-border-hover);
  color: var(--color-text-main);
  transform: translateY(-1px);
}

.btn-icon.danger {
  border-color: rgba(239, 68, 68, 0.25);
  color: var(--color-danger);
}

.btn-icon.danger:hover {
  background: var(--color-danger-bg);
  border-color: var(--color-danger);
  color: var(--color-danger);
}

.edit-form {
  background: var(--color-bg-body);
  padding: 1rem;
  border-radius: 8px;
}

.grid-4-mini {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.input-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg-card);
  color: var(--color-text-main);
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

@media (max-width: 960px) {
  .food-card-body {
    flex-direction: column;
  }

  .item-meta {
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  .item-actions {
    order: 2;
  }

  .macro-badges {
    flex: 1;
    justify-content: flex-start;
  }
}

@media (max-width: 640px) {
  .meal-header {
    align-items: flex-start;
  }

  .meal-totals {
    width: 100%;
    justify-content: flex-start;
  }

  .food-card {
    padding: 0.875rem;
  }

  .item-meta {
    gap: 0.5rem;
  }

  .macro-chip {
    font-size: 0.78rem;
    padding: 0.35rem 0.55rem;
  }

  .btn-icon {
    padding: 6px;
    min-width: 36px;
  }
}
</style>
