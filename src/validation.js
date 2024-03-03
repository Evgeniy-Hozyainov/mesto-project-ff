function enableValidation(validationConfig) {
  const {
    formSelector,         // '.popup__form'
    inputSelector,        // '.popup__input'
    submitButtonSelector, // '.popup__button'
    inactiveButtonClass,  // 'popup__button_disabled'
    inputErrorClass,      // 'popup__input_type_error'
    errorClass,           // 'popup__error_visible'
  } = validationConfig;

  const hasInvalidInput = (inputs) => {
    return inputs.some((input) => !input.validity.valid);
  };

  const toggleButtonState = (inputs, button) => {    
    if (hasInvalidInput(inputs)) {
      button.disabled = true;
      button.classList.add(inactiveButtonClass);
    } else {
      button.disabled = false;
      button.classList.remove(inactiveButtonClass);
    }
  };

  const showInputError = (form, input, errMsg) => {
    const errorElement = form.querySelector(`.${input.id}-error`);

    input.classList.add(inputErrorClass);
    errorElement.textContent = errMsg;
    errorElement.classList.add(errorClass);
  };

  const hideInputError = (form, input) => {
    const errorElement = form.querySelector(`.${input.id}-error`);

    input.classList.remove(inputErrorClass);
    errorElement.textContent = '';
    errorElement.classList.remove(errorClass);
  };

  const isValidInput = (form, input) => {
    if (input.validity.patternMismatch) {
      input.setCustomValidity(input.dataset.errorMessage);
    } else {
      input.setCustomValidity('');
    }

    if (!input.validity.valid) {
      showInputError(form, input, input.validationMessage);
    } else {
      hideInputError(form, input);
    }
  };

  const forms = [...document.querySelectorAll(formSelector)];
  forms.forEach((form) => {
    const inputs = [...form.querySelectorAll(inputSelector)];
    const button = form.querySelector(submitButtonSelector);

    toggleButtonState(inputs, button);

    inputs.forEach((input) => {
      input.addEventListener('input', () => {
        isValidInput(form, input);
        toggleButtonState(inputs, button);
      });
    });
  });
}

function clearValidation(form, validationConfig) {
  const {
    inputSelector,        // '.popup__input'
    submitButtonSelector, // '.popup__button'
    inactiveButtonClass,  // 'popup__button_disabled'
    inputErrorClass,      // 'popup__input_type_error'
    errorClass,           // 'popup__error_visible'
  } = validationConfig;

  const inputs = [...form.querySelectorAll(inputSelector)];
  inputs.forEach((input) => {
    input.classList.remove(inputErrorClass);
    const errElement = form.querySelector(`.${input.id}-error`);
    errElement.classList.remove(errorClass);
    errElement.textContent = '';
  });

  const submitButton = form.querySelector(submitButtonSelector);
  submitButton.disabled = true;
  submitButton.classList.add(inactiveButtonClass);
}

export { enableValidation, clearValidation };
