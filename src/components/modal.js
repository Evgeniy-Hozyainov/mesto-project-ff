// Обработчик закрытия открытого модального окна при нажатии на клавишу Esc.
// После закрытия окна обработчик события удаляется.
function closeOnEsc(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    if (openedPopup) {
      openedPopup.classList.remove("popup_is-opened");
      document.removeEventListener("keydown", closeOnEsc);
    }
  }
}

/**
 * Открывает указанное модальное окно и добавляет обработчик события 'keydown'
 * для закрытия окна при нажатии на клавишу Esc.
 * @param {HTMLElement} modal - Элемент модального окна, которое нужно открыть.
 */
function openModal(modal) {
  modal.classList.add("popup_is-opened");
  document.addEventListener("keydown", closeOnEsc);
}

/**
 * Закрывает указанное модальное окно и удаляет обработчик события 'keydown',
 * который закрывает окно при нажатии на клавишу Esc.
 * @param {HTMLElement} modal - Элемент модального окна, которое нужно закрыть.
 */
function closeModal(modal) {
  modal.classList.remove("popup_is-opened");
  window.removeEventListener("keydown", closeOnEsc);
}

export { openModal, closeModal };
