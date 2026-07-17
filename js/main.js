import { applySettings, loadSettings } from "./settings-storage.js";

function initSettings() {
  const settings = loadSettings();
  applySettings(settings);

  if (settings.theme === "system") {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () => applySettings(loadSettings()));
  }
}

document.addEventListener("DOMContentLoaded", initSettings);
