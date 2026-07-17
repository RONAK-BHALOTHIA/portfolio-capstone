/**
 * Settings page: validation, theme handling, save/reset behavior.
 */
(function () {
  "use strict";

  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var MIN_PASSWORD_LENGTH = 8;

  var form;
  var statusMessage;
  var fields;
  var savedSnapshot;

  function $(id) {
    return document.getElementById(id);
  }

  function getSelectedTheme() {
    var selected = form.querySelector('input[name="theme"]:checked');
    return selected ? selected.value : "system";
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
  }

  function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = "status-message status-message--" + type;
    statusMessage.hidden = false;
  }

  function clearStatus() {
    statusMessage.textContent = "";
    statusMessage.className = "status-message";
    statusMessage.hidden = true;
  }

  function setFieldError(fieldKey, message) {
    var field = fields[fieldKey];
    field.input.setAttribute("aria-invalid", message ? "true" : "false");
    field.error.textContent = message || "";
  }

  function clearAllErrors() {
    Object.keys(fields).forEach(function (key) {
      if (fields[key].error) {
        setFieldError(key, "");
      }
    });
  }

  function validateName(value) {
    var trimmed = value.trim();

    if (!trimmed) {
      return "Name is required.";
    }

    return "";
  }

  function validateEmail(value) {
    var trimmed = value.trim();

    if (!trimmed) {
      return "Email is required.";
    }

    if (!EMAIL_PATTERN.test(trimmed)) {
      return "Enter a valid email address.";
    }

    return "";
  }

  function validatePassword(value) {
    if (!value) {
      return "";
    }

    if (value.length < MIN_PASSWORD_LENGTH) {
      return "Password must be at least 8 characters.";
    }

    return "";
  }

  function validateConfirmPassword(password, confirmPassword) {
    if (!password && !confirmPassword) {
      return "";
    }

    if (password && !confirmPassword) {
      return "Confirm your password.";
    }

    if (!password && confirmPassword) {
      return "Enter a password before confirming it.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  }

  function validateForm() {
    var name = fields.name.input.value;
    var email = fields.email.input.value;
    var password = fields.password.input.value;
    var confirmPassword = fields.confirmPassword.input.value;

    var nameError = validateName(name);
    var emailError = validateEmail(email);
    var passwordError = validatePassword(password);
    var confirmError = validateConfirmPassword(password, confirmPassword);

    setFieldError("name", nameError);
    setFieldError("email", emailError);
    setFieldError("password", passwordError);
    setFieldError("confirmPassword", confirmError);

    var firstInvalidKey = ["name", "email", "password", "confirmPassword"].find(function (key) {
      return fields[key].error && fields[key].error.textContent;
    });

    if (firstInvalidKey) {
      fields[firstInvalidKey].input.focus();
      return false;
    }

    return true;
  }

  function populateForm(settings) {
    fields.name.input.value = settings.name;
    fields.email.input.value = settings.email;

    var themeInput = form.querySelector('input[name="theme"][value="' + settings.theme + '"]');
    if (themeInput) {
      themeInput.checked = true;
    }

    fields.password.input.value = "";
    fields.confirmPassword.input.value = "";
    applyTheme(settings.theme);
  }

  function readFormValues() {
    return {
      name: fields.name.input.value.trim(),
      email: fields.email.input.value.trim(),
      theme: getSelectedTheme(),
    };
  }

  function handleSave(event) {
    event.preventDefault();
    clearStatus();
    clearAllErrors();

    if (!validateForm()) {
      showStatus("Fix the highlighted fields before saving.", "error");
      return;
    }

    var values = readFormValues();
    var result = SettingsStorage.saveSettings(values);

    if (!result.success) {
      showStatus("Could not save settings. " + result.error, "error");
      return;
    }

    savedSnapshot = Object.assign({}, result.settings);
    fields.password.input.value = "";
    fields.confirmPassword.input.value = "";
    showStatus("Settings saved successfully.", "success");
  }

  function handleReset(event) {
    event.preventDefault();
    clearStatus();
    clearAllErrors();
    populateForm(savedSnapshot);
    showStatus("Form reset to last saved settings.", "success");
  }

  function handleThemePreview(event) {
    if (event.target.name === "theme") {
      applyTheme(event.target.value);
    }
  }

  function handleSystemThemeChange(event) {
    if (getSelectedTheme() === "system") {
      applyTheme("system");
    }
  }

  function bindLiveValidation() {
    fields.name.input.addEventListener("blur", function () {
      setFieldError("name", validateName(fields.name.input.value));
    });

    fields.email.input.addEventListener("blur", function () {
      setFieldError("email", validateEmail(fields.email.input.value));
    });

    fields.password.input.addEventListener("blur", function () {
      var password = fields.password.input.value;
      setFieldError("password", validatePassword(password));

      if (fields.confirmPassword.input.value) {
        setFieldError(
          "confirmPassword",
          validateConfirmPassword(password, fields.confirmPassword.input.value)
        );
      }
    });

    fields.confirmPassword.input.addEventListener("blur", function () {
      setFieldError(
        "confirmPassword",
        validateConfirmPassword(fields.password.input.value, fields.confirmPassword.input.value)
      );
    });
  }

  function init() {
    form = $("settings-form");
    statusMessage = $("status-message");
    $("footer-year").textContent = String(new Date().getFullYear());

    fields = {
      name: { input: $("name"), error: $("name-error") },
      email: { input: $("email"), error: $("email-error") },
      password: { input: $("password"), error: $("password-error") },
      confirmPassword: { input: $("confirm-password"), error: $("confirm-password-error") },
    };

    savedSnapshot = SettingsStorage.getSettings();
    populateForm(savedSnapshot);

    form.addEventListener("submit", handleSave);
    form.addEventListener("reset", handleReset);
    form.addEventListener("change", handleThemePreview);
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", handleSystemThemeChange);

    bindLiveValidation();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
