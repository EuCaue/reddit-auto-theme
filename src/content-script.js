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
 * Make the button for toggle theme visibile in the DOM.
 * @returns {HTMLElement?}
 */
function makeThemeToggleVisible() {
  const drawerBtn = document.querySelector("#expand-user-drawer-button");
  const themeToggleBtn = document.querySelector("faceplate-switch-input");
  if (themeToggleBtn) {
    log("Theme toggle button found.", themeToggleBtn);
    return null;
  }
  if (!drawerBtn) {
    log("Drawer button not found.");
    return null;
  }
  log("Theme toggle button not found.");
  if (!themeToggleBtn) {
    drawerBtn.click();
    setTimeout(() => {
      drawerBtn.click();
    }, 1000);
    return drawerBtn;
  }
}

/**
 * Toggle the current theme.
 * @returns void
 */
function toggleTheme() {
  const themeToggleBtn = document.querySelector("faceplate-switch-input");
  if (themeToggleBtn) {
    document.documentElement.style.pointerEvents = "none";
    themeToggleBtn.click();
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
    makeThemeToggleVisible();
    toggleTheme();
  }

  darkThemeMq.addEventListener("change", (e) => {
    log("System theme has changed.");
    const isDarkTheme =
      document.documentElement.classList.contains("theme-dark");
    if (e.matches !== isDarkTheme) {
      log("Changing theme.");
      makeThemeToggleVisible();
      toggleTheme();
    }
  });
});

console.info("[REDDIT-AUTO-THEME]: EXTENSION LOADED.");
