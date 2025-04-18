const PROD = false;

/**
 * @param { "log" | "warn" | "error" | "log"} level - log level
 * @param {string} message - The message to be logged.
 * @returns void
 */
function customLogger(level, ...message) {
  if (PROD) return;

  const levels = {
    info: "log",
    info: "info",
    warn: "warn",
    error: "error",
    debug: "debug",
  };

  const EXT_NAME = "REDDIT-AUTO-THEME";

  if (levels[level]) {
    console[level](EXT_NAME, level, ...message);
  } else {
    console.log(EXT_NAME, "default level", level, ...message);
  }
}

/**
 * Toggle the current theme.
 * @returns void
 */
function toggleTheme() {
  document.documentElement.style.pointerEvents = "none";
  const drawerBtn = document.querySelector("#expand-user-drawer-button");
  if (!drawerBtn) return customLogger("warn", "Drawer button not found.");
  drawerBtn.click();
  drawerBtn.click();
  const observer = new MutationObserver(() => {
    const themeToggleBtn = document.querySelector("faceplate-switch-input");
    if (themeToggleBtn) {
      observer.disconnect();
      setTimeout(() => {
        themeToggleBtn.click();
        customLogger("info", "Toggling theme");
        document.documentElement.style.pointerEvents = "";
        document.documentElement.focus();
      }, 800);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

window.addEventListener("DOMContentLoaded", () => {
  const isDarkTheme = document.documentElement.classList.contains("theme-dark");
  const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");

  if (darkThemeMq.matches !== isDarkTheme) {
    toggleTheme();
  }

  darkThemeMq.addEventListener("change", (e) => {
    customLogger("info", "System theme changed.");
    const isDarkTheme =
      document.documentElement.classList.contains("theme-dark");
    if (e.matches !== isDarkTheme) {
      toggleTheme();
    }
  });
});
customLogger("info", "EXTENSION LOADED.");
