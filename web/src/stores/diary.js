import { defineStore } from "pinia";
import {
  addDiaryItem,
  copyDiaryRange,
  deleteDiaryItem,
  getDiary,
  updateDiaryItem,
} from "../services/api";
import { useAuthStore } from "./auth";
import { useWeekStore } from "./week";

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
        // Refresh streak info
        await useAuthStore().fetchMe();
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
