<template>
  <section class="page">
    <h2 class="page-title">Resumo semanal</h2>
    <div v-if="weekStore.loading" class="loading">Carregando...</div>
    <div v-else-if="weekStore.error" class="error">{{ weekStore.error }}</div>
    <div v-else-if="weekStore.weekSummary" class="stack">
      <section class="card">
        <h3>Meta semanal</h3>
        
        <div class="tabs" style="margin-bottom: 1rem;">
          <button 
            type="button" 
            :class="['tab', { active: targetStrategy === 'fixed_kcal' }]" 
            @click="targetStrategy = 'fixed_kcal'"
          >
            Meta Fixa (Kcal)
          </button>
          <button 
            type="button" 
            :class="['tab', { active: targetStrategy === 'daily_macros' }]" 
            @click="targetStrategy = 'daily_macros'"
          >
            Meta por Macros
          </button>
        </div>

        <div v-if="targetStrategy === 'fixed_kcal'">
          <div class="grid-2">
            <label class="field">
              Kcal alvo (Semanal)
              <input v-model.number="targetKcal" type="number" min="0" step="50" />
            </label>
          </div>
          <p class="muted" style="margin-top: 0.5rem;">
            Equivalente a <strong>{{ (targetKcal / 7).toFixed(0) }}</strong> kcal/dia.
          </p>
        </div>

        <div v-else>
          <p class="muted" style="margin-bottom: 1rem;">
            Defina suas metas <strong>diárias</strong> de macronutrientes. O sistema calculará a meta calórica semanal automaticamente.
          </p>
          <div class="grid-2" style="grid-template-columns: repeat(3, 1fr);">
            <label class="field">
              Proteína (g)
              <input v-model.number="targetProtein" type="number" min="0" />
            </label>
            <label class="field">
              Carbo (g)
              <input v-model.number="targetCarbs" type="number" min="0" />
            </label>
            <label class="field">
              Gordura (g)
              <input v-model.number="targetFat" type="number" min="0" />
            </label>
          </div>
          <div class="card" style="background: #f1f5f9; border: none; margin-top: 1rem; padding: 1rem;">
            <p style="margin: 0; font-size: 0.9rem; color: var(--color-text-muted);">Estimativa:</p>
            <div style="display: flex; gap: 1rem; margin-top: 0.25rem;">
              <div><strong>{{ calculatedDailyKcal.toFixed(0) }}</strong> kcal/dia</div>
              <div><strong>{{ (calculatedDailyKcal * 7).toFixed(0) }}</strong> kcal/semana</div>
            </div>
          </div>
        </div>

        <button class="btn" type="button" :disabled="!canSaveTarget" @click="saveTarget" style="margin-top: 1.5rem;">
          Salvar Configuração
        </button>
      </section>

      <WeekProjectionCard :week-summary="weekStore.weekSummary" />
      
      <section class="card">
        <h3>Dia a dia</h3>
        <ul class="week-list">
          <li v-for="day in weekStore.weekSummary.days" :key="day.date">
            <div>
              <p class="item-title">{{ formatDateBR(day.date) }}</p>
              <p class="muted">{{ (day.kcal ?? 0).toFixed(0) }} kcal</p>
            </div>
            <RouterLink class="btn ghost" :to="`/day/${day.date}`">Ver</RouterLink>
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { RouterLink } from 'vue-router';
import { useWeekStore } from '../stores/week';
import WeekProjectionCard from '../components/WeekProjectionCard.vue';
import { formatDateBR, toISODateLocal } from '../utils/date';
import { getWeeklyTarget, setWeeklyTarget } from '../services/api';

const weekStore = useWeekStore();
const toast = useToast();

const targetStrategy = ref('fixed_kcal'); // 'fixed_kcal' | 'daily_macros'
const targetKcal = ref(0); // Weekly
const targetProtein = ref(0); // Daily
const targetCarbs = ref(0); // Daily
const targetFat = ref(0); // Daily
const saving = ref(false);

const calculatedDailyKcal = computed(() => {
  return (targetProtein.value * 4) + (targetCarbs.value * 4) + (targetFat.value * 9);
});

const canSaveTarget = computed(() => {
  if (saving.value) return false;
  if (targetStrategy.value === 'fixed_kcal') {
    return targetKcal.value >= 0;
  }
  return targetProtein.value >= 0 && targetCarbs.value >= 0 && targetFat.value >= 0;
});

onMounted(() => {
  weekStore.loadWeekSummary(toISODateLocal());
  loadTarget();
});

async function loadTarget() {
  try {
    const data = await getWeeklyTarget();
    targetStrategy.value = data.strategy || 'fixed_kcal';
    targetKcal.value = data.kcal ?? 14000;
    
    // Convert weekly macros back to daily for display
    targetProtein.value = (data.macros?.protein_g ?? 0) / 7;
    targetCarbs.value = (data.macros?.carbs_g ?? 0) / 7;
    targetFat.value = (data.macros?.fat_g ?? 0) / 7;
  } catch (err) {
    console.error(err);
  }
}

async function saveTarget() {
  if (!canSaveTarget.value) return;
  saving.value = true;
  
  try {
    const payload = {
      strategy: targetStrategy.value,
    };

    if (targetStrategy.value === 'fixed_kcal') {
      payload.kcal = Number(targetKcal.value);
    } else {
      payload.macros = {
        protein_g: Number(targetProtein.value),
        carbs_g: Number(targetCarbs.value),
        fat_g: Number(targetFat.value),
      };
    }

    await setWeeklyTarget(payload);
    await weekStore.loadWeekSummary(toISODateLocal());
    toast.success('Meta semanal atualizada!');
  } catch (err) {
    toast.error(err?.response?.data?.error?.message || 'Erro ao salvar meta semanal');
  } finally {
    saving.value = false;
  }
}
</script>
