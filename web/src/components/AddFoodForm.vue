<template>
  <section class="add-form">
    <div class="tabs" style="margin-bottom: 1rem;">
      <button v-for="t in tabs" :key="t" type="button" :class="['tab', { active: currentTab === t }]"
        @click="currentTab = t">
        {{ labels[t] }}
      </button>
    </div>

    <!-- Meal Selector (Shared) -->
    <div class="meal-selector">
      <div class="meal-pills">
        <button v-for="m in meals" :key="m.id" type="button" class="meal-pill"
          :class="{ active: selectedMeal === m.id }" @click="selectedMeal = m.id">
          {{ m.label }}
        </button>
      </div>
    </div>

    <!-- Manual / Search Tab -->
    <div v-if="currentTab === 'manual'" class="tab-panel panel">
      <div class="search-wrapper">
        <label class="field rel">
          Descricao
          <input v-model="manual.label" type="text" placeholder="Ex: arroz, frango" @input="onSearchInput"
            @focus="showDropdown = true" @blur="onBlur" />
          <!-- Dropsown -->
          <ul v-if="showDropdown && searchResults.length > 0" class="dropdown">
            <li v-for="item in searchResults" :key="item._id" @click="selectFoodItem(item)" class="dropdown-item">
              {{ item.name }}
            </li>
          </ul>
        </label>
      </div>

      <div class="grid-2 qty-grid">
        <label class="field">
          Quantidade
          <input v-model.number="manual.qty" type="number" min="0" step="0.1" @input="recalcIfBasedOnItem" />
        </label>
        <label class="field">
          Unidade
          <input v-model="manual.unit" type="text" placeholder="un" />
        </label>
      </div>

      <div class="grid-macros">
        <label class="field">
          Kcal
          <input v-model.number="manual.macros.kcal" type="number" min="0" step="0.1" />
        </label>
        <label class="field">
          Proteina (g)
          <input v-model.number="manual.macros.protein_g" type="number" min="0" step="0.1" />
        </label>
        <label class="field">
          Carb (g)
          <input v-model.number="manual.macros.carbs_g" type="number" min="0" step="0.1" />
        </label>
        <label class="field">
          Gord (g)
          <input v-model.number="manual.macros.fat_g" type="number" min="0" step="0.1" />
        </label>
      </div>

      <button class="btn primary-wide" type="button" :disabled="!canAddManual" @click="submitManual">
        Adicionar
      </button>
    </div>

    <!-- AI Tab -->
    <div v-else-if="currentTab === 'ai'" class="tab-panel panel ai-panel">
      <div class="ai-head">
        <div>
          <p class="eyebrow">Assistente</p>
          <h3>Adicionar com IA</h3>
          <p class="muted">Digite, fale ou envie uma foto das macros e nós calculamos para você.</p>
        </div>
        <button type="button" class="chip action" @click="toggleDictation" :class="{ active: isListening }">
          <span v-if="!isListening">🎙️ Falar</span>
          <span v-else>🛑 Gravando...</span>
        </button>
      </div>

      <label class="field rel">
        Descreva o que voce comeu
        <textarea ref="aiInputRef" v-model="aiText" rows="4"
          placeholder="Ex: cafe com leite, 2 paes franceses, 1 banana"></textarea>
        <!-- Mic Button -->
        <button type="button" class="btn-mic" :class="{ listening: isListening }" @click="toggleDictation"
          title="Falar alimento">
          <span v-if="!isListening">🎙️</span>
          <span v-else>🛑</span>
        </button>
      </label>

      <div class="file-block">
        <div class="file-text">
          <p class="label tight">Ou envie uma imagem</p>
          <p class="muted">Foto do prato ou print das macros (opcional).</p>
        </div>
        <div class="file-upload-wrapper">
          <input id="ai-image-upload" type="file" accept="image/*" class="file-input" @change="onImageChange" />
          <label for="ai-image-upload" class="file-label btn ghost">
            <span v-if="!aiFileName">📷 Escolher imagem</span>
            <span v-else>🔄 Trocar imagem</span>
          </label>
          <span v-if="aiFileName" class="file-name">{{ aiFileName }}</span>
        </div>
      </div>

      <div class="hint-row">
        <span class="hint-badge">Dica</span>
        <span class="muted">Fale em frases curtas: “200g frango grelhado, 1 colher arroz, salada verde”.</span>
      </div>

      <button class="btn primary-wide" type="button" :disabled="!canAddAi || loading" @click="submitAi">
        {{ loading ? 'Enviando...' : 'Enviar para IA' }}
      </button>
    </div>

    <!-- Food Item Popup Modal -->
    <div v-if="showPopup && selectedItem" class="modal-overlay" @click.self="showPopup = false">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ selectedItem.name }}</h3>
          <button class="close-btn" @click="showPopup = false">&times;</button>
        </div>
        <div class="modal-body">
          <p class="section-title">Informações Nutricionais (Base 100g)</p>
          <div class="base-info">
            <span>{{ selectedItem.calories }} kcal</span>
            <span>P: {{ selectedItem.protein }}g</span>
            <span>C: {{ selectedItem.carbs }}g</span>
            <span>G: {{ selectedItem.fat }}g</span>
          </div>

          <hr class="separator" />

          <label class="field">
            Quantidade Consumida (g)
            <input v-model.number="popupQty" type="number" min="1" step="0.1" ref="popupInputRef" />
          </label>

          <div class="calculated-preview">
            <strong>Calculado:</strong>
            <span>{{ (selectedItem.calories * popupQty / 100).toFixed(1) }} kcal</span>
            <span>P: {{ (selectedItem.protein * popupQty / 100).toFixed(1) }}g</span>
            <span>C: {{ (selectedItem.carbs * popupQty / 100).toFixed(1) }}g</span>
            <span>G: {{ (selectedItem.fat * popupQty / 100).toFixed(1) }}g</span>
          </div>

          <button class="btn full-width" @click="confirmPopup">
            Confirmar
          </button>
        </div>
      </div>
    </div>

  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { searchFoods } from '../services/api';
import { useToast } from 'vue-toastification';

const toast = useToast();
// Ensure searchFoods now calls /food-items/search

const props = defineProps({
  loading: Boolean,
});

const emit = defineEmits(['add', 'add-ai']);

const tabs = ['manual', 'ai'];
const labels = {
  manual: 'Manual',
  ai: 'IA',
};

const meals = [
  { id: 'breakfast', label: 'Café' },
  { id: 'lunch', label: 'Almoço' },
  { id: 'snack', label: 'Lanche' },
  { id: 'dinner', label: 'Jantar' },
  { id: 'supper', label: 'Ceia' },
];

function getDefaultMeal() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 15) return 'lunch';
  if (hour >= 15 && hour < 18) return 'snack';
  if (hour >= 18 && hour < 22) return 'dinner';
  return 'supper'; // Late night or early morning
}

const selectedMeal = ref(getDefaultMeal());

const currentTab = ref('manual');

// Manual Form State
const manual = ref({
  label: '',
  qty: 1,
  unit: 'g', // default to grams for database items
  macros: { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 },
});

// Search & Autocomplete
const searchResults = ref([]);
const showDropdown = ref(false);
const debounceTimer = ref(null);

// Item Popup State
const showPopup = ref(false);
const selectedItem = ref(null); // The raw item from database
const popupQty = ref(100);

// AI State
const aiText = ref('');
const aiImageDataUrl = ref('');
const aiFileName = ref('');

// Speech Recognition
const isListening = ref(false);
const aiInputRef = ref(null);
let recognition = null;

function toggleDictation() {
  if (isListening.value) {
    recognition?.stop();
    isListening.value = false;
    return;
  }

  // Blur textarea to ensure UI update state is clean usually fixes mobile keyboard issues or cursor conflicts
  if (aiInputRef.value) {
    aiInputRef.value.blur();
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Seu navegador não suporta reconhecimento de voz.");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = 'pt-BR';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    isListening.value = true;
  };

  recognition.onend = () => {
    isListening.value = false;
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (transcript) {
      if (aiText.value) {
        aiText.value += ' ' + transcript;
      } else {
        aiText.value = transcript;
      }
    }
  };

  recognition.onError = (event) => {
    console.error("Speech error", event);
    isListening.value = false;
  };

  recognition.start();
}

const canAddManual = computed(() => {
  return (
    manual.value.label &&
    manual.value.unit &&
    manual.value.qty > 0 &&
    manual.value.macros.kcal >= 0
  );
});
const canAddAi = computed(() => Boolean(aiText.value.trim() || aiImageDataUrl.value));

function onSearchInput() {
  showDropdown.value = true;
  if (debounceTimer.value) clearTimeout(debounceTimer.value);
  debounceTimer.value = setTimeout(async () => {
    if (manual.value.label.length < 2) {
      searchResults.value = [];
      return;
    }
    try {
      searchResults.value = await searchFoods(manual.value.label);
    } catch (e) {
      console.error(e);
      searchResults.value = [];
    }
  }, 300);
}

function selectFoodItem(item) {
  selectedItem.value = item;
  popupQty.value = 100; // Reset to standard portion
  showDropdown.value = false;
  showPopup.value = true;
}

function confirmPopup() {
  if (!selectedItem.value) return;

  // Calculate values based on popupQty
  const factor = popupQty.value / 100;

  manual.value.label = selectedItem.value.name;
  manual.value.qty = popupQty.value;
  manual.value.unit = 'g';
  manual.value.macros = {
    kcal: Number((selectedItem.value.calories * factor).toFixed(1)),
    protein_g: Number((selectedItem.value.protein * factor).toFixed(1)),
    carbs_g: Number((selectedItem.value.carbs * factor).toFixed(1)),
    fat_g: Number((selectedItem.value.fat * factor).toFixed(1)),
  };

  // Store current base item to allow recalculation if user changes quantity in main form
  // (Optional feature, implementing basic version first)
  // Actually, storing it somewhere could be nice:
  manual.value._baseItem = selectedItem.value;

  showPopup.value = false;
  showDropdown.value = false;
}

// Logic to auto-recalc if user manually changes quantity AFTER selecting an item
function recalcIfBasedOnItem() {
  if (manual.value._baseItem && manual.value.unit === 'g') {
    const factor = manual.value.qty / 100;
    const base = manual.value._baseItem;
    manual.value.macros.kcal = Number((base.calories * factor).toFixed(1));
    manual.value.macros.protein_g = Number((base.protein * factor).toFixed(1));
    manual.value.macros.carbs_g = Number((base.carbs * factor).toFixed(1));
    manual.value.macros.fat_g = Number((base.fat * factor).toFixed(1));
  }
}

// Close dropdown if clicking outside (simplified by bluring or careful usage)
// A global click listener would be better but V-If on dropdown works for now. 
// Adding a small delay to blur to allow click event to register.
function onBlur() {
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);
}

function submitManual() {
  emit('add', {
    type: 'manual',
    label: manual.value.label,
    qty: Number(manual.value.qty),
    unit: manual.value.unit,
    macros: {
      kcal: Number(manual.value.macros.kcal),
      protein_g: Number(manual.value.macros.protein_g),
      carbs_g: Number(manual.value.macros.carbs_g),
      fat_g: Number(manual.value.macros.fat_g),
    },
    meal: selectedMeal.value,
  });
  // Reset
  manual.value = {
    label: '',
    qty: 1,
    unit: 'g',
    macros: { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 },
    _baseItem: null
  };
}

function submitAi() {
  emit('add-ai', {
    text: aiText.value.trim() || undefined,
    meal: selectedMeal.value,
    imageDataUrl: aiImageDataUrl.value || undefined,
  });
}

function onImageChange(event) {
  const file = event.target.files?.[0];
  if (!file) {
    aiImageDataUrl.value = '';
    aiFileName.value = '';
    return;
  }

  // Validation: Max 5MB
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    toast.error("A imagem deve ter no máximo 5MB.");
    event.target.value = ''; // Reset input
    return;
  }

  // Validation: Type
  if (!file.type.startsWith('image/')) {
    toast.error("Apenas arquivos de imagem são permitidos.");
    event.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    aiImageDataUrl.value = String(reader.result || '');
    aiFileName.value = file.name;
  };
  reader.readAsDataURL(file);
}
</script>

<style scoped>
.rel {
  position: relative;
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  box-shadow: var(--shadow-sm);
}

.tab-panel {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.meal-selector {
  margin: 0.5rem 0 1rem;
  overflow-x: auto;
  padding: 0.25rem 0.25rem 0.5rem;
}

.meal-pills {
  display: flex;
  gap: 0.6rem;
  padding-bottom: 4px;
}

.meal-pill {
  background: color-mix(in srgb, var(--color-bg-body) 80%, transparent);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 0.9rem;
  color: var(--color-text-main);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.meal-pill.active {
  background: var(--color-primary-light);
  border-color: var(--color-primary);
  color: var(--color-primary-dark);
  font-weight: 700;
}

.search-wrapper {
  margin-bottom: 0.5rem;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 0 0 8px 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 50;
  list-style: none;
  padding: 0;
  margin: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  padding: 0.75rem;
  cursor: pointer;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.9rem;
  color: var(--color-text-main);
}

.dropdown-item:hover {
  background: var(--color-bg-body);
}

.ai-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.chip.action {
  background: var(--color-bg-body);
  border: 1px solid var(--color-border);
  color: var(--color-text-main);
  padding: 0.5rem 0.85rem;
  border-radius: var(--radius-full);
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  transition: all 0.2s;
}

.chip.action:hover {
  border-color: var(--color-border-hover);
  background: color-mix(in srgb, var(--color-bg-body) 80%, var(--color-bg-card));
}

.chip.action.active {
  border-color: var(--color-primary);
  color: var(--color-primary-dark);
  background: var(--color-primary-light);
}

.file-block {
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
  padding: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.file-text {
  flex: 1;
  min-width: 200px;
}

.label.tight {
  margin: 0 0 0.25rem;
}

.file-upload-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.file-name {
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.hint-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  background: var(--color-bg-body);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.65rem 0.8rem;
}

.hint-badge {
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full);
  font-size: 0.85rem;
}

.qty-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 1rem;
}

.grid-macros {
  display: grid;
  grid-template-columns: repeat(4, minmax(120px, 1fr));
  gap: 0.75rem;
}

.primary-wide {
  align-self: flex-start;
  min-width: 180px;
}

@media (max-width: 960px) {
  .panel {
    padding: 1rem;
  }

  .grid-macros {
    grid-template-columns: repeat(2, minmax(140px, 1fr));
  }

  .primary-wide {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .qty-grid {
    grid-template-columns: 1fr;
  }

  .grid-macros {
    grid-template-columns: repeat(2, 1fr);
  }

  .meal-selector {
    margin-top: 0.25rem;
  }

  .file-block {
    padding: 0.75rem;
  }

  .file-upload-wrapper {
    width: 100%;
    justify-content: space-between;
  }
}

/* Modal Styles Reuse */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal {
  background: var(--color-bg-card);
  padding: 1.5rem;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  color: var(--color-text-main);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--color-text-main);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-text-muted);
}

.section-title {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.base-info {
  display: flex;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: var(--color-text-main);
}

.separator {
  margin: 1rem 0;
  border: 0;
  border-top: 1px solid var(--color-border);
}

.calculated-preview {
  margin: 1rem 0;
  background: var(--color-bg-body);
  padding: 0.75rem;
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text-main);
}

.btn-mic {
  position: absolute;
  bottom: 12px;
  right: 12px;
  border: none;
  background: var(--color-bg-card);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: 0.2s;
  color: var(--color-text-main);
}

.btn-mic:hover {
  background: var(--color-bg-body);
  transform: scale(1.1);
}

.btn-mic.listening {
  background: #fee2e2;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}
</style>
