<template>
  <div class="app">
    <!-- Top Header (Logo + Account Actions) -->
    <header class="app-header">
      <div class="logo-area">
        <img :src="isDark ? logoHorWhite : logoHor" alt="MacroWeek" class="app-logo" />
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

        <!-- Interaction Streak -->
        <!-- <div v-if="authStore.user?.streak > 0" class="streak-badge" title="Dias seguidos de interação">
          🔥 {{ authStore.user.streak }} dias
        </div> -->

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
        <svg class="nav-svg" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="6" width="16" height="14" rx="3" />
          <path d="M8 4v4M16 4v4M4 10h16" />
          <circle cx="9" cy="13" r="1.1" />
          <circle cx="13" cy="13" r="1.1" />
          <circle cx="17" cy="13" r="1.1" />
          <circle cx="9" cy="17" r="1.1" />
        </svg>
        <span class="label">Hoje</span>
      </RouterLink>
      <RouterLink to="/week" class="nav-item">
        <svg class="nav-svg" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="5" y="11" width="3.5" height="8" rx="1" />
          <rect x="10.25" y="8" width="3.5" height="11" rx="1" />
          <rect x="15.5" y="5" width="3.5" height="14" rx="1" />
        </svg>
        <span class="label">Semana</span>
      </RouterLink>
      <RouterLink to="/calculator" class="nav-item">
        <svg class="nav-svg" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="6" y="4" width="12" height="16" rx="2" />
          <line x1="6" y1="9" x2="18" y2="9" />
          <circle cx="10" cy="13" r="0.9" />
          <circle cx="14" cy="13" r="0.9" />
          <circle cx="10" cy="17" r="0.9" />
          <circle cx="14" cy="17" r="0.9" />
        </svg>
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
import logoHor from '@/assets/logo_hor.png';
import logoHorWhite from '@/assets/logo_hor_white.png';

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
  height: 68px;
  background: var(--color-bg-card);
  background: color-mix(in srgb, var(--color-bg-card) 92%, transparent);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
  box-shadow: 0 -6px 30px rgba(0, 0, 0, 0.12);
  padding: 6px clamp(12px, 3vw, 20px) env(safe-area-inset-bottom, 0);
  gap: 0.75rem;
}

/* Nav Items */
.nav-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: var(--color-text-muted);
  font-size: 0.72rem;
  letter-spacing: 0.02em;
  font-weight: 600;
  gap: 6px;
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 6px 8px;
  border-radius: 14px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.nav-item:hover {
  color: var(--color-text-main);
  background: var(--color-bg-body);
}

.nav-svg {
  width: 22px;
  height: 22px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.6;
  opacity: 0.7;
  transition: all 0.2s ease;
}

/* Active State */
.nav-item.router-link-active {
  color: var(--color-primary);
}

.nav-item.router-link-active .nav-svg {
  opacity: 1;
  transform: translateY(-1px);
}

/* Active Indicator Dot (Optional style enhancement) */
.nav-item.router-link-active::after {
  content: none;
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

.streak-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #fb923c;
  /* Orange-400 */
  background: rgba(251, 146, 60, 0.15);
  border: 1px solid rgba(251, 146, 60, 0.3);
  box-shadow: 0 0 10px rgba(251, 146, 60, 0.1);
  white-space: nowrap;
  animation: pulse-fire 2s infinite ease-in-out;
}

@keyframes pulse-fire {
  0% {
    box-shadow: 0 0 0 0 rgba(251, 146, 60, 0.2);
  }

  70% {
    box-shadow: 0 0 0 6px rgba(251, 146, 60, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(251, 146, 60, 0);
  }
}
</style>
