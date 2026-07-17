import {
  DEFAULT_SETTINGS,
  applySettings,
  loadSettings,
  resetSettings,
  saveSettings,
} from "./settings-storage.js";

const form = document.getElementById("settings-form");
const statusMessage = document.getElementById("form-status");

function showStatus(message, type = "success") {
  statusMessage.textContent = message;
  statusMessage.className = `form-status form-status--${type}`;
}

function populateForm(settings) {
  form.displayName.value = settings.displayName;
  form.tagline.value = settings.tagline;
  form.theme.value = settings.theme;
  form.email.value = settings.email;
  form.showEmail.checked = settings.showEmail;
  form.animations.checked = settings.animations;
}

function getFormValues() {
  return {
    displayName: form.displayName.value.trim() || DEFAULT_SETTINGS.displayName,
    tagline: form.tagline.value.trim() || DEFAULT_SETTINGS.tagline,
    theme: form.theme.value,
    email: form.email.value.trim(),
    showEmail: form.showEmail.checked,
    animations: form.animations.checked,
  };
}

function validateSettings(settings) {
  if (settings.showEmail && !settings.email) {
    showStatus("Please enter an email address or turn off public email display.", "error");
    form.email.focus();
    return false;
  }

  if (settings.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
    showStatus("Please enter a valid email address.", "error");
    form.email.focus();
    return false;
  }

  return true;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const settings = getFormValues();
  if (!validateSettings(settings)) {
    return;
  }

  saveSettings(settings);
  applySettings(settings);
  showStatus("Settings saved successfully.");
});

form.addEventListener("reset", (event) => {
  event.preventDefault();

  const settings = resetSettings();
  populateForm(settings);
  applySettings(settings);
  showStatus("Settings reset to defaults.");
});

form.addEventListener("input", () => {
  if (statusMessage.textContent) {
    statusMessage.textContent = "";
    statusMessage.className = "form-status";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const settings = loadSettings();
  populateForm(settings);
  applySettings(settings);
});
