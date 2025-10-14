const PROD = false;
let isToggling = false;
let initialized = false;

/**
 * @param {string} message - The message to be logged.
 * @returns void
 */
function log(...message) {
  if (!PROD) console.log("[REDDIT-AUTO-THEME]: ", ...message);
}

/**
 *
 * Toggle the current theme.
 * @returns {HTMLElement?}
 */
function toggleTheme() {
  if (isToggling) return;
  const drawerBtn = document.querySelector("#expand-user-drawer-button");
  if (!drawerBtn) {
    return null;
  }
  drawerBtn.click();
  isToggling = true;
  setTimeout(() => {
    clickToggleThemeBtn();
  }, 1500);
  setTimeout(() => {
    drawerBtn.click();
  }, 375);
  return drawerBtn;
}

/**
 * Click on the toggle theme button
 * @returns void
 */
function clickToggleThemeBtn() {
  const themeToggleBtn = document.querySelector("faceplate-switch-input");
  if (themeToggleBtn) {
    document.documentElement.style.pointerEvents = "none";
    themeToggleBtn.click();
    document.documentElement.style.pointerEvents = "auto";
    document.activeElement.blur();
    isToggling = false;
  }
}

/**
 * @returns {Promise<HTMLElement>} -
 */
function waitForHeader() {
  return new Promise((resolve) => {
    const header = document.querySelector("header");
    if (header) return resolve(header);

    const observer = new MutationObserver(() => {
      const header = document.querySelector("header");
      if (header) {
        observer.disconnect();
        resolve(header);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
}

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

prefersDark.addEventListener("change", (e) => {
  log("System theme has changed.");
  const html = document.documentElement;
  const isDarkNow = html.classList.contains("theme-dark");
  if (e.matches !== isDarkNow) {
    log("Changing theme.");
    toggleTheme();
  }
});

async function main() {
  await waitForHeader();

  log("Header element loaded.");
  const html = document.documentElement;
  const isDark = html.classList.contains("theme-dark");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  if (prefersDark.matches !== isDark) {
    log("Syncing theme with system.");
    toggleTheme();
  }

  console.info("[REDDIT-AUTO-THEME]: EXTENSION LOADED.");
}

async function mainOnce() {
  if (initialized) return;
  initialized = true;
  await main();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mainOnce, { once: true });
} else {
  mainOnce();
}

window.addEventListener("focus", async () => {
  await main();
});
