import { defineStore } from "pinia";
import api from "../services/api";

function getStoredToken() {
  return localStorage.getItem("auth_token");
}

function setStoredToken(token) {
  if (token) {
    localStorage.setItem("auth_token", token);
  } else {
    localStorage.removeItem("auth_token");
  }
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: getStoredToken(),
    user: null,
    loading: false,
    error: null,
    showUpgradeModal: false,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
    credits: (state) => state.user?.credits ?? 0,
  },
  actions: {
    decrementCredits() {
      if (this.user && this.user.credits > 0) {
        this.user.credits--;
      }
    },
    async login(credentials) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post("/api/auth/login", credentials);
        this.token = data.token;
        this.user = data.user;
        setStoredToken(data.token);
        return true;
      } catch (err) {
        this.error = err?.response?.data?.error?.message || "Erro ao entrar";
        return false;
      } finally {
        this.loading = false;
      }
    },
    async register(credentials) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post("/api/auth/register", credentials);
        this.token = data.token;
        this.user = data.user;
        setStoredToken(data.token);
        return true;
      } catch (err) {
        this.error = err?.response?.data?.error?.message || "Erro ao cadastrar";
        return false;
      } finally {
        this.loading = false;
      }
    },
    async fetchMe() {
      if (!this.token) {
        return false;
      }
      try {
        const { data } = await api.get("/api/auth/me");
        this.user = data.user;
        return true;
      } catch (err) {
        this.logout();
        return false;
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      setStoredToken(null);
    },
    async subscribeToPlus() {
      try {
        // Assume API is configured with baseURL
        const { data } = await api.post("/api/payment/create-checkout-session");
        if (data.url) {
          window.location.href = data.url;
          return true;
        }
      } catch (err) {
        console.error("Subscription error", err);
        this.error = "Erro ao iniciar checkout.";
        return false;
      }
    },
    async manageSubscription() {
      try {
        const { data } = await api.post("/api/payment/create-portal-session");
        if (data.url) {
          window.location.href = data.url;
          return true;
        }
      } catch (err) {
        console.error("Portal error", err);
        this.error = "Erro ao acessar portal de assinatura.";
        return false;
      }
    },
  },
});
