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
            <h3>{{ mealLabels[mealKey] }}</h3>
            <div class="meal-totals">
              <span>{{ getGroupTotals(groupedItems[mealKey]).kcal.toFixed(0) }} kcal</span>
              <span class="macro-mini">P: {{ getGroupTotals(groupedItems[mealKey]).protein_g.toFixed(0) }}</span>
              <span class="macro-mini">C: {{ getGroupTotals(groupedItems[mealKey]).carbs_g.toFixed(0) }}</span>
              <span class="macro-mini">G: {{ getGroupTotals(groupedItems[mealKey]).fat_g.toFixed(0) }}</span>
            </div>
          </div>

          <ul class="items-list">
            <li v-for="item in groupedItems[mealKey]" :key="item.originalIndex">
              <div v-if="editingIndex !== item.originalIndex" style="width: 100%;">
                <div class="item-row">
                  <div class="item-info">
                    <p class="item-title">{{ item.label }}</p>
                    <p class="muted">
                      {{ item.qty }} {{ item.unit }}
                    </p>
                  </div>

                  <div class="item-right-side">
                    <div class="item-stats">
                      <strong>{{ item.kcal.toFixed(0) }}</strong>
                      <small>kcal</small>
                    </div>

                    <div class="item-actions">
                      <button class="btn-icon" title="Editar" @click="startEdit(item, item.originalIndex)">✏️</button>
                      <button class="btn-icon" title="Duplicar" @click="$emit('duplicate', item)">📋</button>
                      <button class="btn-icon danger" title="Remover"
                        @click="$emit('remove', item.originalIndex)">🗑️</button>
                    </div>
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
}

.meal-header h3 {
  font-size: 1.1rem;
  color: var(--color-primary);
  margin: 0;
}

.meal-totals {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.macro-mini {
  font-size: 0.75rem;
  background: var(--color-bg-body);
  padding: 2px 6px;
  border-radius: 4px;
}

.items-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.items-list li {
  padding: 1.5rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
  transition: background-color 0.2s;
}

.items-list li:hover {
  background-color: var(--color-bg-body);
  border-radius: 8px;
  /* Slight radius on hover */
}

.items-list li:last-child {
  border-bottom: none;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  /* Force full width */
}

.item-info {
  flex: 1;
  padding-right: 1rem;
}

.item-right-side {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
  /* Crucial: Push this block to the far right */
}

.item-stats {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  /* Force align right */
  justify-content: center;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
  opacity: 0.8;
  /* Make them more visible by default */
  transition: opacity 0.2s;
}

.items-list li:hover .item-actions {
  opacity: 1;
}

.btn-icon {
  border: 1px solid transparent;
  /* Prepare for border on hover */
  background: transparent;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 8px;
  border-radius: 8px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
}

.btn-icon:hover {
  background: var(--color-bg-body);
  border-color: var(--color-border);
  color: var(--color-text-main);
  transform: translateY(-1px);
}

.btn-icon.danger:hover {
  background: #fee2e2;
  border-color: #fca5a5;
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
</style>
