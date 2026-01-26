import { defineStore } from 'pinia';
import { getWeekSummary } from '../services/api';

export const useWeekStore = defineStore('week', {
  state: () => ({
    weekSummary: null,
    loading: false,
    error: null,
  }),
  actions: {
    async loadWeekSummary(date) {
      this.loading = true;
      this.error = null;
      try {
        this.weekSummary = await getWeekSummary(date);
      } catch (err) {
        this.error = err?.response?.data?.error?.message || 'Erro ao carregar semana';
      } finally {
        this.loading = false;
      }
    },
  },
});
