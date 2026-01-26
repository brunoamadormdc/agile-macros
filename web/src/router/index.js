import { createRouter, createWebHistory } from "vue-router";
import TodayPage from "../pages/TodayPage.vue";
import DayPage from "../pages/DayPage.vue";
import WeekPage from "../pages/WeekPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import CalculatorPage from "../pages/CalculatorPage.vue";
import PlansPage from "../pages/PlansPage.vue";
import { useAuthStore } from "../stores/auth";

const routes = [
  { path: "/", redirect: "/today" },
  { path: "/login", component: LoginPage, meta: { guestOnly: true } },
  { path: "/register", component: RegisterPage, meta: { guestOnly: true } },
  { path: "/today", component: TodayPage, meta: { requiresAuth: true } },
  {
    path: "/day/:date",
    component: DayPage,
    props: true,
    meta: { requiresAuth: true },
  },
  { path: "/week", component: WeekPage, meta: { requiresAuth: true } },
  {
    path: "/calculator",
    component: CalculatorPage,
    meta: { requiresAuth: true },
  },
  { path: "/plans", component: PlansPage, meta: { requiresAuth: true } },
  {
    path: "/forgot-password",
    component: () => import("../pages/ForgotPasswordPage.vue"),
    meta: { guestOnly: true },
  },
  {
    path: "/reset-password",
    component: () => import("../pages/ResetPasswordPage.vue"),
    meta: { guestOnly: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (authStore.token && !authStore.user) {
    await authStore.fetchMe();
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return "/login";
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return "/today";
  }

  return true;
});

export default router;
