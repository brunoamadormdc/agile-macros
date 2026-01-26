<template>
  <div class="app">
    <!-- Top Header (Logo + Account Actions) -->
    <header class="app-header">
      <div class="logo-area">
        <img src="@/assets/logo.png" alt="Agile Macros" class="app-logo" />
      </div>

      <!-- Account actions -->
      <div class="header-actions" v-if="authStore.isAuthenticated">
        <div class="user-info">
          <span class="user-email">{{ authStore.user?.email }}</span>
          <span class="plan-badge" :class="authStore.user?.plan">
            {{ authStore.user?.plan === 'plus' ? '🏆 Plus' : 'Free' }}
          </span>
        </div>

        <RouterLink v-if="authStore.user?.plan === 'free'" to="/plans" class="btn small upgrade" title="Ver Planos">
          💎 Planos
        </RouterLink>

        <!-- Only show credits on Free/Basic plans -->
        <div v-if="authStore.user?.plan !== 'plus'" class="credits-badge" title="Créditos de IA">
          ⚡ {{ authStore.credits }}
        </div>

        <button class="btn ghost small icon-only" type="button" @click="toggleTheme"
          :title="isDark ? 'Modo Claro' : 'Modo Escuro'">
          {{ isDark ? '🌞' : '🌙' }}
        </button>

        <button class="btn ghost small" type="button" @click="logout" title="Sair">
          Sair
        </button>
      </div>

      <!-- Guest Nav -->
      <nav class="nav-links" v-else>
        <RouterLink to="/login">Entrar</RouterLink>
        <RouterLink to="/register">Criar conta</RouterLink>
      </nav>
    </header>

    <main class="app-main">
      <RouterView />
    </main>

    <!-- Bottom Navigation (Authenticated Only) -->
    <nav class="bottom-nav" v-if="authStore.isAuthenticated">
      <RouterLink to="/today" class="nav-item">
        <span class="icon">📅</span>
        <span class="label">Hoje</span>
      </RouterLink>
      <RouterLink to="/week" class="nav-item">
        <span class="icon">📊</span>
        <span class="label">Semana</span>
      </RouterLink>
      <RouterLink to="/calculator" class="nav-item">
        <span class="icon">🧮</span>
        <span class="label">Calculadora</span>
      </RouterLink>
    </nav>

    <UpgradeModal />
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { useTheme } from './composables/useTheme';
import UpgradeModal from './components/UpgradeModal.vue';

const router = useRouter();
const authStore = useAuthStore();
const { isDark, toggleTheme } = useTheme();
//...

function logout() {
  authStore.logout();
  router.push('/login');
}
</script>

<style scoped>
/* App Shell Adjustments for Bottom Nav */
.app {
  padding-bottom: 80px;
  /* Space for fixed bottom bar */
  min-height: 100vh;
  position: relative;
}

/* Header Actions (Logout/Credits) */
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-actions .btn.small {
  padding: 0.4rem 0.75rem;
  font-size: 0.85rem;
  height: auto;
  text-decoration: none;
  /* Ensure link looks like button */
}

.btn.upgrade {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 6px rgba(245, 158, 11, 0.2);
  margin-top: 0;
  /* Override generic .btn margin */
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.btn.upgrade:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 8px rgba(245, 158, 11, 0.3);
  filter: brightness(1.1);
}

/* Bottom Navigation Bar */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 64px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
  padding-bottom: env(safe-area-inset-bottom, 0);
  /* iOS Safe Area */
}

/* Nav Items */
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: var(--color-text-light);
  /* Inactive color */
  font-size: 0.7rem;
  font-weight: 500;
  gap: 4px;
  flex: 1;
  height: 100%;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.nav-item .icon {
  font-size: 1.5rem;
  line-height: 1;
  opacity: 0.6;
  filter: grayscale(100%);
  transition: all 0.2s;
}

/* Active State */
.nav-item.router-link-active {
  color: var(--color-primary);
}

.nav-item.router-link-active .icon {
  opacity: 1;
  filter: none;
  transform: translateY(-2px);
}

/* Active Indicator Dot (Optional style enhancement) */
.nav-item.router-link-active::after {
  content: '';
  position: absolute;
  top: 6px;
  right: 50%;
  transform: translateX(50%);
  margin-right: -10px;
  /* Offset to side */
  width: 4px;
  height: 4px;
  background: var(--color-primary);
  border-radius: 50%;
  opacity: 0;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 12px;

}



/* User Info Styles */
.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 1rem;
  line-height: 1.2;
}

.user-email {
  font-size: 0.8rem;
  color: var(--color-text-main);
  font-weight: 500;
}

.plan-badge {
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
  background: #e2e8f0;
  color: #64748b;
  font-weight: 700;
  text-transform: uppercase;
  display: inline-block;
}

.plan-badge.plus {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
}

@media (max-width: 600px) {
  .user-email {
    display: none;
    /* Hide email on mobile to save space */
  }
}

.app-logo {
  width: 300px;
  height: auto;
}
</style>
