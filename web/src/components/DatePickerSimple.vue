<template>
  <div class="date-picker-wrapper">
    <div class="date-header" @click="openPicker">
      <h2 class="current-date-text">{{ displayDate }}</h2>
      <span class="edit-icon">📅</span>
      <input ref="pickerInput" type="date" :value="modelValue" @input="onChange" class="hidden-picker" />
    </div>

    <div class="week-strip">
      <button v-for="day in weekDays" :key="day.iso" class="day-bubble"
        :class="{ active: day.iso === modelValue, today: day.isToday }" @click="selectDate(day.iso)" type="button">
        <span class="weekday">{{ day.weekdayName }}</span>
        <span class="day-num">{{ day.dayNum }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { toISODateLocal } from '../utils/date';

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);
const pickerInput = ref(null);

function onChange(event) {
  emit('update:modelValue', event.target.value);
}

function selectDate(iso) {
  emit('update:modelValue', iso);
}

function openPicker() {
  if (pickerInput.value && pickerInput.value.showPicker) {
    pickerInput.value.showPicker();
  } else {
    // Fallback? Or just try focusing
    pickerInput.value?.focus();
    // Maybe make the input visible enough to be clicked but transparent?
    // Using CSS pointer-events trick is better for fallback compatibility if showPicker isn't supported.
  }
}

const displayDate = computed(() => {
  if (!props.modelValue) return 'Selecione uma data';

  const [y, m, d] = props.modelValue.split('-').map(Number);
  const date = new Date(y, m - 1, d);

  const currentYear = new Date().getFullYear();
  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  };

  if (y !== currentYear) {
    options.year = 'numeric';
  }

  const str = new Intl.DateTimeFormat('pt-BR', options).format(date);
  // Capitalize
  return str.charAt(0).toUpperCase() + str.slice(1);
});

const weekDays = computed(() => {
  if (!props.modelValue) return [];

  const [y, m, d] = props.modelValue.split('-').map(Number);
  const current = new Date(y, m - 1, d);

  // Calculate start of week (Monday)
  // getDay(): 0 = Sun, 1 = Mon, ...
  const dayOfWeek = current.getDay();
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // If Sun(0) subtract 6 to get Mon, else subtract day-1

  const startOfWeek = new Date(current);
  startOfWeek.setDate(current.getDate() - daysToSubtract);

  const days = [];
  const todayIso = toISODateLocal();

  // Monday to Sunday initials
  const weekNames = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);

    // Format ISO manually to avoid UTC issues
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const iso = `${year}-${month}-${day}`;

    days.push({
      iso,
      dayNum: day,
      weekdayName: weekNames[i],
      isToday: iso === todayIso
    });
  }

  return days;
});
</script>

<style scoped>
.date-picker-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.date-header {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  transition: background 0.2s;
  position: relative;
}

.date-header:hover {
  background: var(--color-bg-hover, rgba(0, 0, 0, 0.05));
}

.current-date-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-main);
  margin: 0;
  text-transform: capitalize;
}

.edit-icon {
  font-size: 1.2rem;
  opacity: 0.7;
}

.hidden-picker {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 10;
  cursor: pointer;
}

.week-strip {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 500px;
  /* Optional: cap width so bubbles don't get huge on desktop */
  padding: 0.25rem;
}

.day-bubble {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  /* Occupy available space */
  max-width: 60px;
  /* Cap per-bubble width */
  height: 64px;
  /* Slightly taller */
  border-radius: 16px;
  /* Slightly squarer for wider bubbles */
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.day-bubble:hover {
  background: var(--color-bg-hover);
}

.day-bubble.active {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.day-bubble:not(.active) {
  color: var(--color-text-main);
}

.day-bubble.today:not(.active) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.weekday {
  font-size: 0.75rem;
  opacity: 0.8;
  margin-bottom: 2px;
}

.day-num {
  font-size: 1.1rem;
  font-weight: 700;
}

/* Hide scrollbar */
.week-strip::-webkit-scrollbar {
  display: none;
}
</style>
