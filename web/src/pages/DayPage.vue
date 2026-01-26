<template>
  <DayView :date="date" />
</template>

<script setup>
import { computed } from 'vue';
import DayView from './DayView.vue';

const props = defineProps({
  date: {
    type: String,
    required: true,
  },
});

const date = computed(() => props.date);
</script>
