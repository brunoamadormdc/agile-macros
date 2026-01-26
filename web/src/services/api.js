import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getDiary(date) {
  return api.get(`/api/diary/${date}`).then((res) => res.data);
}

export function addDiaryItem(date, payload) {
  return api.post(`/api/diary/${date}/items`, payload).then((res) => res.data);
}

export function deleteDiaryItem(date, index) {
  return api
    .delete(`/api/diary/${date}/items/${index}`)
    .then((res) => res.data);
}

export function updateDiaryItem(date, index, payload) {
  return api
    .put(`/api/diary/${date}/items/${index}`, payload)
    .then((res) => res.data);
}

export function getWeekSummary(date) {
  return api
    .get("/api/week/summary", { params: { date } })
    .then((res) => res.data);
}

export function searchFoods(query) {
  // Point to the new backend endpoint for FoodItems search
  return api
    .get("/api/food-items/search", { params: { q: query } })
    .then((res) => res.data.items);
}

export function getPresets() {
  return api.get("/api/presets").then((res) => res.data);
}

export function addDiaryFromAi(date, payload) {
  return api.post(`/api/diary/${date}/ai`, payload).then((res) => res.data);
}

export function copyDiaryRange(date, payload) {
  return api
    .post(`/api/diary/${date}/copy-range`, payload)
    .then((res) => res.data);
}

export function getWeeklyTarget() {
  return api.get("/api/targets/weekly").then((res) => res.data);
}

export function setWeeklyTarget(payload) {
  return api.post("/api/targets/weekly", payload).then((res) => res.data);
}

// Auth Methods
export function login(email, password) {
  return api
    .post("/api/auth/login", { email, password })
    .then((res) => res.data);
}

export function register(email, password) {
  return api
    .post("/api/auth/register", { email, password })
    .then((res) => res.data);
}

export function forgotPassword(email) {
  return api
    .post("/api/auth/forgot-password", { email })
    .then((res) => res.data);
}

export function resetPassword(token, password) {
  return api
    .post("/api/auth/reset-password", { token, password })
    .then((res) => res.data);
}

export default api;
