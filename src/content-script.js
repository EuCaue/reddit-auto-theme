const PROD = false;

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
  const drawerBtn = document.querySelector("#expand-user-drawer-button");
  const themeToggleBtn = document.querySelector("faceplate-switch-input");
  if (!drawerBtn) {
    log("Drawer button not found.");
    return null;
  }
  log("Theme toggle button not found.");
  drawerBtn.click();
  setTimeout(() => {
    drawerBtn.click();
    clickToggleThemeBtn(themeToggleBtn);
  }, 1000);
  return drawerBtn;
}

/**
 * Click on the toggle theme button
 * @param {HTMLButtonElement} btn
 * @returns void
 */
function clickToggleThemeBtn(btn) {
  if (btn) {
    console.log("TOGGLING");
    document.documentElement.style.pointerEvents = "none";
    btn.click();
    document.documentElement.style.pointerEvents = "";
    document.activeElement.blur();
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

waitForHeader().then(() => {
  console.info("Header element loaded.");
  const isDarkTheme = document.documentElement.classList.contains("theme-dark");
  const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");

  if (darkThemeMq.matches !== isDarkTheme) {
    toggleTheme();
  }

  darkThemeMq.addEventListener("change", (e) => {
    log("System theme has changed.");
    const isDarkTheme =
      document.documentElement.classList.contains("theme-dark");
    if (e.matches !== isDarkTheme) {
      log("Changing theme.");
      toggleTheme();
    }
  });
});

console.info("[REDDIT-AUTO-THEME]: EXTENSION LOADED.");
