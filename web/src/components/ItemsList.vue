<template>
  <section class="card">
    <h2>Itens do dia</h2>
    <div v-if="!items.length" class="empty-state">
      <p>Nenhum item hoje.</p>
      <p class="muted">Adicione algo para comecar.</p>
    </div>
    <ul v-else class="items-list">
      <li v-for="(item, index) in items" :key="`${item.label}-${index}`">
        <div v-if="editingIndex !== index">
          <p class="item-title">{{ item.label }}</p>
          <p class="muted">
            {{ item.qty }} {{ item.unit }} · {{ item.kcal.toFixed(0) }} kcal
          </p>
        </div>
        <div v-else class="edit-form">
          <label class="field" style="margin-bottom: 0.75rem;">
            Descricao
            <input v-model="editForm.label" type="text" placeholder="Descricao" />
          </label>

          <div class="grid-2" style="grid-template-columns: 2fr 1fr; margin-bottom: 0.75rem;">
            <label class="field">
              Quantidade
              <input v-model.number="editForm.qty" type="number" min="0" step="0.1" placeholder="Qty"
                @input="onQtyChange" />
            </label>
            <label class="field">
              Unidade
              <input v-model="editForm.unit" type="text" placeholder="Unidade" />
            </label>
          </div>

          <div class="grid-2" style="grid-template-columns: repeat(4, 1fr); margin-bottom: 1.5rem;">
            <label class="field">
              Kcal
              <input v-model.number="editForm.macros.kcal" type="number" min="0" step="0.1" placeholder="Kcal" />
            </label>
            <label class="field">
              Proteina (g)
              <input v-model.number="editForm.macros.protein_g" type="number" min="0" step="0.1"
                placeholder="Proteina" />
            </label>
            <label class="field">
              Carboidrato (g)
              <input v-model.number="editForm.macros.carbs_g" type="number" min="0" step="0.1"
                placeholder="Carboidrato" />
            </label>
            <label class="field">
              Gordura (g)
              <input v-model.number="editForm.macros.fat_g" type="number" min="0" step="0.1" placeholder="Gordura" />
            </label>
          </div>

          <div class="edit-actions"
            style="display: flex; gap: 0.75rem; justify-content: flex-end; border-top: 1px solid var(--color-border); padding-top: 1rem;">
            <button class="btn ghost" type="button" @click="cancelEdit">
              Cancelar
            </button>
            <button class="btn" type="button" @click="saveEdit(index)">
              Salvar
            </button>
          </div>
        </div>
        <div v-if="editingIndex !== index" class="item-actions">
          <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
            <button class="btn btn-edit" type="button" @click="startEdit(item, index)">
              Editar
            </button>
            <button class="btn btn-edit" type="button" @click="$emit('duplicate', item)">
              Duplicar
            </button>
            <button class="btn btn-remove" type="button" @click="$emit('remove', index)">
              Remover
            </button>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['remove', 'update', 'duplicate']);

const editingIndex = ref(null);
const editForm = ref({
  label: '',
  qty: 1,
  unit: '',
  macros: { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 },
});

const baseRatios = ref({ kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 });

function startEdit(item, index) {
  editingIndex.value = index;
  editForm.value = {
    label: item.label,
    qty: item.qty,
    unit: item.unit,
    macros: {
      kcal: item.kcal,
      protein_g: item.protein_g,
      carbs_g: item.carbs_g,
      fat_g: item.fat_g,
    },
  };

  // Calculate base ratios per 1 unit of quantity
  // Avoid division by zero
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
.item-actions .btn {
  margin-top: 0;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
}

.btn-edit {
  background-color: var(--color-bg-body);
  color: var(--color-primary-dark);
  border: 1px solid var(--color-border);
}

.btn-edit:hover {
  background-color: var(--color-primary-light);
  border-color: var(--color-primary);
  color: var(--color-primary-dark);
}

.btn-remove {
  background-color: #fef2f2;
  /* Light red */
  color: var(--color-danger);
  border: 1px solid #fee2e2;
}

.btn-remove:hover {
  background-color: var(--color-danger);
  border-color: var(--color-danger);
  color: white;
}
</style>
