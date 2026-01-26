import { defineStore } from "pinia";
import {
  addDiaryFromAi,
  addDiaryItem,
  copyDiaryRange,
  deleteDiaryItem,
  getDiary,
  updateDiaryItem,
} from "../services/api";
import { useWeekStore } from "./week";
import { useAuthStore } from "./auth";

export const useDiaryStore = defineStore("diary", {
  state: () => ({
    selectedDate: null,
    diary: null,
    loading: false,
    error: null,
  }),
  actions: {
    async loadDiary(date) {
      this.loading = true;
      this.error = null;
      try {
        this.selectedDate = date;
        this.diary = await getDiary(date);
      } catch (err) {
        this.error =
          err?.response?.data?.error?.message || "Erro ao carregar diario";
      } finally {
        this.loading = false;
      }
    },
    async addItem(payload) {
      const weekStore = useWeekStore();
      this.error = null;
      try {
        await addDiaryItem(this.selectedDate, payload);
        await this.loadDiary(this.selectedDate);
        await weekStore.loadWeekSummary(this.selectedDate);
        return true;
      } catch (err) {
        this.error =
          err?.response?.data?.error?.message || "Erro ao adicionar item";
        return false;
      }
    },
    async removeItem(index) {
      const weekStore = useWeekStore();
      this.error = null;
      try {
        await deleteDiaryItem(this.selectedDate, index);
        await this.loadDiary(this.selectedDate);
        await weekStore.loadWeekSummary(this.selectedDate);
        return true;
      } catch (err) {
        this.error =
          err?.response?.data?.error?.message || "Erro ao remover item";
        return false;
      }
    },
    async updateItem(index, payload) {
      const weekStore = useWeekStore();
      this.error = null;
      try {
        await updateDiaryItem(this.selectedDate, index, payload);
        await this.loadDiary(this.selectedDate);
        await weekStore.loadWeekSummary(this.selectedDate);
        return true;
      } catch (err) {
        this.error =
          err?.response?.data?.error?.message || "Erro ao atualizar item";
        return false;
      }
    },
    async addFromAi(payload) {
      const weekStore = useWeekStore();
      const authStore = useAuthStore(); // Lazy import-like usage
      this.error = null;
      this.loading = true; // Ensure loading state is set manually if not handled by interceptors/components
      try {
        await addDiaryFromAi(this.selectedDate, payload);
        authStore.decrementCredits();
        await this.loadDiary(this.selectedDate);
        await weekStore.loadWeekSummary(this.selectedDate);
        return true;
      } catch (err) {
        if (err.response?.status === 402) {
          authStore.showUpgradeModal = true;
          return false; // Don't set this.error to avoid ugly banner
        }
        this.error =
          err?.response?.data?.error?.message || "Erro ao processar IA";
        return false;
      } finally {
        this.loading = false;
      }
    },
    async copyToRange(payload) {
      const weekStore = useWeekStore();
      this.error = null;
      try {
        await copyDiaryRange(this.selectedDate, payload);
        await this.loadDiary(this.selectedDate);
        await weekStore.loadWeekSummary(this.selectedDate);
        return true;
      } catch (err) {
        this.error =
          err?.response?.data?.error?.message || "Erro ao copiar itens";
        return false;
      }
    },
  },
});
