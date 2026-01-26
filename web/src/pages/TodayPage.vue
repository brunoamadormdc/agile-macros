<template>
  <DayView :date="today" />
</template>

<script setup>
import { computed } from 'vue';
import DayView from './DayView.vue';
import { toISODateLocal } from '../utils/date';

const today = computed(() => toISODateLocal());
</script>
