import { ref, onMounted, watch } from "vue";

const isDark = ref(false);

export function useTheme() {
  function toggleTheme() {
    isDark.value = !isDark.value;
    updateTheme();
  }

  function updateTheme() {
    const root = document.documentElement;
    if (isDark.value) {
      root.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }

  function initTheme() {
    const saved = localStorage.getItem("theme");
    // Default to dark mode if no specific preference for light mode exists
    if (saved === "light") {
      isDark.value = false;
    } else {
      isDark.value = true;
    }
    updateTheme();
  }

  onMounted(() => {
    initTheme();
  });

  return {
    isDark,
    toggleTheme,
  };
}
