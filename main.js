(function () {
  var form = document.getElementById("demo-form");
  if (!form) {
    return;
  }

  var openIconPath = "./oeil_ouvert.svg";
  var closedIconPath = "./oeil_ferme.svg";

  function setFieldErrorState(input, hasError) {
    var label = input.closest("label");
    if (!label) {
      return;
    }

    var helper = label.querySelector("small");
    var defaultText = helper ? helper.getAttribute("data-default-text") || helper.textContent : "";
    var customError = input.getAttribute("data-error");

    input.setAttribute("aria-invalid", hasError ? "true" : "false");
    label.classList.toggle("is-error", hasError);

    if (helper) {
      helper.textContent = hasError
        ? (customError || input.validationMessage || defaultText)
        : defaultText;
    }
  }

  function validateInput(input) {
    var value = input.value.trim();

    if (value.length === 0) {
      setFieldErrorState(input, false);
      return true;
    }

    var isValid = input.checkValidity();
    setFieldErrorState(input, !isValid);
    return isValid;
  }

  function handleToggleClick(button) {
    var fieldWrapper = button.closest(".password-field");
    if (!fieldWrapper) {
      return;
    }

    var passwordInput = fieldWrapper.querySelector('input[type="password"], input[type="text"]');
    var icon = button.querySelector("img");

    if (!passwordInput) {
      return;
    }

    var showPassword = passwordInput.type === "password";
    passwordInput.type = showPassword ? "text" : "password";

    button.setAttribute("aria-pressed", showPassword ? "true" : "false");
    button.setAttribute(
      "aria-label",
      showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
    );

    if (icon) {
      icon.setAttribute("src", showPassword ? closedIconPath : openIconPath);
    }
  }

  var inputs = form.querySelectorAll("input[type='text'], input[type='password']");
  for (var i = 0; i < inputs.length; i += 1) {
    (function (input) {
      input.addEventListener("input", function () {
        validateInput(input);
      });

      input.addEventListener("blur", function () {
        validateInput(input);
      });

      setFieldErrorState(input, false);
    })(inputs[i]);
  }

  var toggleButtons = form.querySelectorAll(".password-toggle");
  for (var j = 0; j < toggleButtons.length; j += 1) {
    (function (button) {
      button.addEventListener("click", function () {
        handleToggleClick(button);
      });
    })(toggleButtons[j]);
  }

  form.addEventListener("submit", function (event) {
    var hasInvalidField = false;

    for (var i = 0; i < inputs.length; i += 1) {
      var isValid = validateInput(inputs[i]);
      if (!isValid) {
        hasInvalidField = true;
      }
    }

    if (hasInvalidField) {
      event.preventDefault();
    }
  });
})();

