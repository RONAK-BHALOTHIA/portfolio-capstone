/**
 * Shared settings storage for the portfolio site.
 * Persists user preferences in localStorage.
 */

const SETTINGS_KEY = "portfolioSettings";

const DEFAULT_SETTINGS = {
  displayName: "Ronak Bhalothia",
  tagline: "Cybersecurity-focused developer building secure, accessible web experiences.",
  theme: "system",
  showEmail: false,
  email: "",
  animations: true,
};

function loadSettings() {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) {
      return { ...DEFAULT_SETTINGS };
    }

    const parsed = JSON.parse(stored);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function resetSettings() {
  localStorage.removeItem(SETTINGS_KEY);
  return { ...DEFAULT_SETTINGS };
}

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(themePreference) {
  if (themePreference === "system") {
    return getSystemTheme();
  }
  return themePreference;
}

function applySettings(settings) {
  const resolvedTheme = resolveTheme(settings.theme);
  document.documentElement.setAttribute("data-theme", resolvedTheme);
  document.body.classList.toggle("no-animations", !settings.animations);

  const displayNameEl = document.querySelector("[data-setting='displayName']");
  const taglineEl = document.querySelector("[data-setting='tagline']");
  const emailEl = document.querySelector("[data-setting='email']");
  const contactBlock = document.querySelector("[data-setting='contactBlock']");

  if (displayNameEl) {
    displayNameEl.textContent = settings.displayName;
  }

  if (taglineEl) {
    taglineEl.textContent = settings.tagline;
  }

  if (contactBlock) {
    const shouldShow = settings.showEmail && settings.email.trim();
    contactBlock.hidden = !shouldShow;

    if (emailEl && shouldShow) {
      emailEl.textContent = settings.email;
      emailEl.href = `mailto:${settings.email}`;
    }
  }
}

export {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  resetSettings,
  applySettings,
  resolveTheme,
  getSystemTheme,
};
