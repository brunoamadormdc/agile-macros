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
          <span class="plan-badge free">Free</span>
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
        <span class="nav-label">Hoje</span>
      </RouterLink>
      <RouterLink to="/week" class="nav-item">
        <svg class="nav-svg" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="5" y="11" width="3.5" height="8" rx="1" />
          <rect x="10.25" y="8" width="3.5" height="11" rx="1" />
          <rect x="15.5" y="5" width="3.5" height="14" rx="1" />
        </svg>
        <span class="nav-label">Semana</span>
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
        <span class="nav-label">Calculadora</span>
      </RouterLink>
    </nav>
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { useTheme } from './composables/useTheme';
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

/* Bottom Navigation Bar */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 64px;
  gap: 0.25rem;
  padding: 4px clamp(12px, 3vw, 20px) env(safe-area-inset-bottom, 0);
  background: color-mix(in srgb, var(--color-bg-card) 96%, transparent);
  border-top: 1px solid var(--color-border);
  box-shadow: 0 -2px 10px rgb(0 0 0 / 0.06);
  backdrop-filter: blur(10px);
}

/* Nav Items */
.nav-item {
  position: relative;
  display: inline-flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 0;
  height: 100%;
  gap: 3px;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0;
  text-decoration: none;
  transition: color 0.2s, background-color 0.2s;
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

.nav-label {
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1.2;
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
  width: min(300px, 42vw);
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

@media (max-width: 640px) {
  .app {
    padding-bottom: calc(66px + env(safe-area-inset-bottom, 0px));
  }

  .app-logo {
    width: min(170px, 46vw);
  }

  .header-actions .btn.small {
    min-width: 40px;
    padding: 0.375rem 0.5rem;
  }

  .bottom-nav {
    height: calc(56px + env(safe-area-inset-bottom, 0px));
    padding: 3px 10px calc(3px + env(safe-area-inset-bottom, 0px));
  }

  .nav-svg {
    width: 19px;
    height: 19px;
  }

  .nav-label {
    font-size: 0.625rem;
  }

  .streak-badge {
    padding: 0.45rem;
    font-size: 0;
  }

  .streak-badge::first-letter {
    font-size: 1rem;
  }
}
</style>
