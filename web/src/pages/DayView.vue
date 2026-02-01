<template>
  <section class="page">
    <DatePickerSimple :model-value="currentDate" @update:model-value="onDateChange" />

    <div v-if="diaryStore.loading || weekStore.loading" class="stack skeleton-container">
      <!-- Totals Card Skeleton -->
      <section class="card skeleton-card">
        <div class="skeleton-tabs-row">
          <div class="skeleton-tab"></div>
          <div class="skeleton-tab"></div>
        </div>
        <div class="skeleton-header"></div>
        <div class="skeleton-stat-main"></div>
        <div class="skeleton-bar-large"></div>
        <div class="skeleton-macros-row">
          <div class="skeleton-macro-col"></div>
          <div class="skeleton-macro-col"></div>
          <div class="skeleton-macro-col"></div>
        </div>
      </section>

      <!-- Main Content Skeleton -->
      <section class="card skeleton-card">
        <div class="skeleton-tabs-row" style="margin-bottom: 2rem;">
          <div class="skeleton-tab large"></div>
          <div class="skeleton-tab large"></div>
          <div class="skeleton-tab large"></div>
        </div>

        <!-- List items simulation -->
        <div class="skeleton-list-item"></div>
        <div class="skeleton-list-item"></div>
        <div class="skeleton-list-item"></div>
      </section>
    </div>

    <div v-else-if="diaryStore.error || weekStore.error" class="error">
      {{ diaryStore.error || weekStore.error }}
    </div>
    <div v-else class="stack">
      <!-- Stats Tabs -->
      <section class="card">
        <div class="tabs scrollable-tabs">
          <button type="button" :class="['tab', { active: statsTab === 'day' }]" @click="statsTab = 'day'">
            📅 Dia
          </button>
          <button type="button" :class="['tab', { active: statsTab === 'week' }]" @click="statsTab = 'week'">
            📊 Semana
          </button>
        </div>

        <div v-show="statsTab === 'day'" style="margin-top: 1rem;">
          <DayTotalsCard :totals="diaryTotals" :target="weekStore.weekSummary?.dailyTargetKcal || 0"
            :target-macros="weekStore.weekSummary?.dailyTargetMacros || {}"
            :base-target="weekStore.weekSummary?.baseDailyKcal || 0"
            :base-macros="weekStore.weekSummary?.baseDailyMacros || {}" />
        </div>

        <div v-show="statsTab === 'week'" style="margin-top: 1rem;">
          <WeekProjectionCard v-if="weekStore.weekSummary" :week-summary="weekStore.weekSummary" />
        </div>
      </section>

      <!-- Main Content Tabs -->
      <section class="card">
        <div class="tabs scrollable-tabs">
          <button type="button" :class="['tab', { active: mainTab === 'add' }]" @click="mainTab = 'add'">
            ➕ Adicionar
          </button>
          <button type="button" :class="['tab', { active: mainTab === 'copy' }]" @click="mainTab = 'copy'">
            📋 Copiar
          </button>
          <button type="button" :class="['tab', { active: mainTab === 'list' }]" @click="mainTab = 'list'">
            🥗 Diário ({{ diaryItems.length }})
          </button>
        </div>

        <!-- Add Section -->
        <div v-show="mainTab === 'add'" style="margin-top: 2rem;">
          <AddFoodForm :loading="diaryStore.loading" @add="handleAdd" @add-ai="handleAddAi" />
        </div>

        <!-- Copy / Tools Section -->
        <div v-show="mainTab === 'copy'" class="copy-panel">
          <div v-if="isFreePlan" class="empty-state">
            <h3>🔒 Funcionalidade Premium</h3>
            <p>Faça um upgrade para copiar refeições em massa e economizar tempo.</p>
            <button class="btn" @click="authStore.showUpgradeModal = true" style="margin-top: 1rem;">
              Ver Planos
            </button>
          </div>
          <div v-else class="copy-body">
            <header class="copy-head">
              <div>
                <p class="eyebrow">Automatizar semana</p>
                <h2>Copiar itens para intervalo</h2>
                <p class="muted">
                  Duplica os itens de <strong>{{ formatDateBR(currentDate) }}</strong> para um período escolhido.
                </p>
              </div>
              <div class="chip subtle">Seguro: não altera o dia de origem</div>
            </header>

            <div class="copy-grid">
              <DatePickerInput v-model="copyStart" label="Data inicial" placeholder="dd/mm/aaaa" />
              <DatePickerInput v-model="copyEnd" label="Data final" placeholder="dd/mm/aaaa" />
            </div>

            <label class="checkbox copy-check">
              <input v-model="copyOverwrite" type="checkbox" />
              Sobrescrever itens existentes no intervalo
            </label>

            <div class="copy-actions">
              <button class="btn ghost" type="button" @click="copyStart = ''; copyEnd = ''">
                Limpar datas
              </button>
              <button class="btn primary" type="button" :disabled="!canCopyRange" @click="handleCopyRange">
                Copiar itens
              </button>
            </div>
          </div>
        </div>

        <!-- Diary List Section -->
        <div v-show="mainTab === 'list'" style="margin-top: 1rem;">
          <ItemsList :items="diaryItems" @remove="handleRemove" @update="handleUpdate" @duplicate="handleDuplicate" />
        </div>
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { useDiaryStore } from '../stores/diary';
import { useWeekStore } from '../stores/week';
import { useAuthStore } from '../stores/auth';
import DatePickerSimple from '../components/DatePickerSimple.vue';
import DatePickerInput from '../components/DatePickerInput.vue';
import DayTotalsCard from '../components/DayTotalsCard.vue';
import WeekProjectionCard from '../components/WeekProjectionCard.vue';
import ItemsList from '../components/ItemsList.vue';
import AddFoodForm from '../components/AddFoodForm.vue';
import { formatDateBR } from '../utils/date';

const props = defineProps({
  date: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const diaryStore = useDiaryStore();
const weekStore = useWeekStore();
const authStore = useAuthStore();
const toast = useToast();

const isFreePlan = computed(() => authStore.user?.plan === 'free');

const currentDate = computed(() => props.date);
const diaryItems = computed(() => diaryStore.diary?.items || []);
const diaryTotals = computed(() => diaryStore.diary?.totals || { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 });
const copyStart = ref('');
const copyEnd = ref('');
const copyOverwrite = ref(true);
const canCopyRange = computed(() => Boolean(copyStart.value && copyEnd.value));

const mainTab = ref('add'); // 'add' | 'copy' | 'list'
const statsTab = ref('day'); // 'day' | 'week'
// deleted toolTab

async function loadAll(date) {
  await diaryStore.loadDiary(date);
  await weekStore.loadWeekSummary(date);
}

function onDateChange(nextDate) {
  if (nextDate) {
    router.push(`/day/${nextDate}`);
  }
}

async function handleAdd(payload) {
  const ok = await diaryStore.addItem(payload);
  if (ok) {
    toast.success('Item adicionado!');
  } else if (diaryStore.error) {
    toast.error(diaryStore.error);
  }
}

async function handleRemove(index) {
  const ok = await diaryStore.removeItem(index);
  if (ok) {
    toast.success('Item removido!');
  } else if (diaryStore.error) {
    toast.error(diaryStore.error);
  }
}

async function handleUpdate(index, payload) {
  const ok = await diaryStore.updateItem(index, payload);
  if (ok) {
    toast.success('Item atualizado!');
  } else if (diaryStore.error) {
    toast.error(diaryStore.error);
  }
}

async function handleAddAi(payload) {
  const ok = await diaryStore.addFromAi(payload);
  if (ok) {
    toast.success('Itens adicionados via IA!');
  } else if (diaryStore.error) {
    toast.error(diaryStore.error);
  }
}

async function handleCopyRange() {
  if (!canCopyRange.value) {
    return;
  }
  const ok = await diaryStore.copyToRange({
    startDate: copyStart.value,
    endDate: copyEnd.value,
    overwrite: copyOverwrite.value,
  });
  if (ok) {
    toast.success('Itens copiados!');
  } else if (diaryStore.error) {
    toast.error(diaryStore.error);
  }
}

async function handleDuplicate(item) {
  const payload = {
    type: 'manual',
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

  const ok = await diaryStore.addItem(payload);
  if (ok) {
    toast.success('Item duplicado!');
  } else if (diaryStore.error) {
    toast.error(diaryStore.error);
  }
}


onMounted(() => loadAll(props.date));
watch(
  () => props.date,
  (newDate) => {
    if (newDate) {
      loadAll(newDate);
    }
  }
);
</script>

<style scoped>
.dashboard-grid {
  align-items: stretch;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr !important;
  }
}

.small-tabs .tab {
  font-size: 0.85rem;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  background: transparent;
  border: 1px solid transparent;
}

.small-tabs .tab.active {
  background: var(--color-bg-body);
  border-color: var(--color-border);
  font-weight: 600;
}

/* Skeleton Loading Styles */
.skeleton-container {
  width: 100%;
}

.skeleton-card {
  padding: 1.5rem;
}

/* Shimmer Animation */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

.skeleton-tabs-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.skeleton-tab {
  height: 32px;
  width: 80px;
  border-radius: 8px;
  background: linear-gradient(90deg, var(--color-bg-body) 25%, var(--color-border) 50%, var(--color-bg-body) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-tab.large {
  width: 120px;
  height: 40px;
}

.skeleton-header {
  height: 24px;
  width: 150px;
  margin-bottom: 1.5rem;
  border-radius: 4px;
  background: var(--color-bg-body);
}

.skeleton-stat-main {
  height: 60px;
  width: 120px;
  margin: 0 auto 1rem;
  border-radius: 12px;
  background: linear-gradient(90deg, var(--color-bg-body) 25%, var(--color-border) 50%, var(--color-bg-body) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-bar-large {
  height: 24px;
  width: 100%;
  border-radius: 12px;
  margin-bottom: 2rem;
  background: var(--color-bg-body);
  opacity: 0.6;
}

.skeleton-macros-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}

.skeleton-macro-col {
  height: 80px;
  border-radius: 12px;
  background: var(--color-bg-body);
  opacity: 0.5;
}

.skeleton-list-item {
  height: 60px;
  width: 100%;
  margin-bottom: 1rem;
  border-radius: 12px;
  background: linear-gradient(90deg, var(--color-bg-body) 25%, var(--color-border) 50%, var(--color-bg-body) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  opacity: 0.7;
}

.copy-panel {
  margin-top: 1rem;
}

.copy-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-body);
}

.copy-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.chip.subtle {
  background: var(--color-bg-body);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  padding: 0.45rem 0.75rem;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 0.85rem;
}

.copy-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(240px, 1fr));
  gap: 1rem;
}

.copy-check {
  margin-top: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.copy-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.copy-actions .btn.primary {
  min-width: 180px;
}

@media (max-width: 800px) {
  .copy-grid {
    grid-template-columns: 1fr;
  }

  .copy-actions {
    justify-content: flex-start;
  }

  .copy-actions .btn.primary {
    width: 100%;
  }
}

.scrollable-tabs {
  width: 100%;
  overflow-x: auto;
  padding: 0.35rem;
  gap: 0.5rem;
  background: var(--color-bg-body);
  border-radius: var(--radius-full);
}

.scrollable-tabs::-webkit-scrollbar {
  height: 6px;
}

.scrollable-tabs::-webkit-scrollbar-thumb {
  background: var(--color-border-hover);
  border-radius: 999px;
}

.scrollable-tabs .tab {
  white-space: nowrap;
  flex: 1;
  min-width: 140px;
  text-align: center;
}

@media (min-width: 960px) {
  .scrollable-tabs {
    width: fit-content;
  }

  .scrollable-tabs .tab {
    flex: 0 0 auto;
    min-width: 0;
  }
}
</style>
