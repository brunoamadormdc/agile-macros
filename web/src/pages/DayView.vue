<template>
  <section class="page">
    <DatePickerSimple :model-value="currentDate" @update:model-value="onDateChange" />
    <p class="muted">Data selecionada: {{ formatDateBR(currentDate) }}</p>

    <div v-if="diaryStore.loading || weekStore.loading" class="loading">Carregando...</div>
    <div v-else-if="diaryStore.error || weekStore.error" class="error">
      {{ diaryStore.error || weekStore.error }}
    </div>
    <div v-else class="stack">
      <!-- Stats Tabs -->
      <section class="card">
        <div class="tabs">
          <button type="button" :class="['tab', { active: statsTab === 'day' }]" @click="statsTab = 'day'">
            📅 Dia
          </button>
          <button type="button" :class="['tab', { active: statsTab === 'week' }]" @click="statsTab = 'week'">
            📊 Semana
          </button>
        </div>

        <div v-show="statsTab === 'day'" style="margin-top: 1rem;">
          <DayTotalsCard :totals="diaryTotals" :target="weekStore.weekSummary?.dailyTargetKcal || 0"
            :target-macros="weekStore.weekSummary?.dailyTargetMacros || {}" />
        </div>

        <div v-show="statsTab === 'week'" style="margin-top: 1rem;">
          <WeekProjectionCard v-if="weekStore.weekSummary" :week-summary="weekStore.weekSummary" />
        </div>
      </section>

      <!-- Main Content Tabs -->
      <section class="card">
        <div class="tabs">
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
        <div v-show="mainTab === 'add'" style="margin-top: 1rem;">
          <AddFoodForm :loading="diaryStore.loading" @add="handleAdd" @add-ai="handleAddAi" />
        </div>

        <!-- Copy / Tools Section -->
        <div v-show="mainTab === 'copy'" style="margin-top: 1rem;">
          <div v-if="isFreePlan" class="empty-state">
            <h3>🔒 Funcionalidade Premium</h3>
            <p>Faça um upgrade para copiar refeições em massa e economizar tempo.</p>
            <button class="btn" @click="authStore.showUpgradeModal = true" style="margin-top: 1rem;">
              Ver Planos
            </button>
          </div>
          <div v-else>
            <h2>Copiar itens para intervalo</h2>
            <p class="muted">
              Copia os itens de {{ formatDateBR(currentDate) }} para um intervalo de datas.
            </p>
            <div class="grid-2">
              <label class="field">
                Data inicial
                <input v-model="copyStart" type="date" />
              </label>
              <label class="field">
                Data final
                <input v-model="copyEnd" type="date" />
              </label>
            </div>
            <label class="checkbox">
              <input v-model="copyOverwrite" type="checkbox" />
              Sobrescrever itens existentes
            </label>
            <button class="btn" type="button" :disabled="!canCopyRange" @click="handleCopyRange">
              Copiar itens
            </button>
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
</style>
