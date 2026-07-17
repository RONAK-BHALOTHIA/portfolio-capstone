/**
 * Persists portfolio settings in localStorage.
 * Passwords are never stored — only profile and appearance preferences.
 */
(function (global) {
  "use strict";

  var STORAGE_KEY = "portfolioSettings";

  var DEFAULT_SETTINGS = {
    name: "",
    email: "",
    theme: "system",
  };

  function isValidTheme(theme) {
    return theme === "light" || theme === "dark" || theme === "system";
  }

  function sanitizeSettings(data) {
    if (!data || typeof data !== "object") {
      return Object.assign({}, DEFAULT_SETTINGS);
    }

    return {
      name: typeof data.name === "string" ? data.name : DEFAULT_SETTINGS.name,
      email: typeof data.email === "string" ? data.email : DEFAULT_SETTINGS.email,
      theme: isValidTheme(data.theme) ? data.theme : DEFAULT_SETTINGS.theme,
    };
  }

  function getSettings() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return Object.assign({}, DEFAULT_SETTINGS);
      }

      return sanitizeSettings(JSON.parse(raw));
    } catch (error) {
      return Object.assign({}, DEFAULT_SETTINGS);
    }
  }

  function saveSettings(settings) {
    var payload = sanitizeSettings(settings);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      return { success: true, settings: payload };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  global.SettingsStorage = {
    STORAGE_KEY: STORAGE_KEY,
    DEFAULT_SETTINGS: DEFAULT_SETTINGS,
    getSettings: getSettings,
    saveSettings: saveSettings,
  };
})(window);
