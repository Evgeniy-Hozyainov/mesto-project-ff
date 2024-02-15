// Обработчик закрытия открытого модального окна при нажатии на клавишу Esc.
// После закрытия окна обработчик события удаляется.
function closeOnEsc(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    if (openedPopup) {
      closeModal(openedPopup);
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
  document.removeEventListener("keydown", closeOnEsc);
}

/**
 * Обрабатывает клик по модальному окну и закрывает его, если 
 * клик произошел по области с классом "popup" или "popup__close".
 *
 * @param {MouseEvent} evt - Объект события, который передается обработчику событий.
 */
function handleModalCloseClick(evt) {
  if (["popup", "popup__close"].some(className =>
      evt.target.classList.contains(className))) {
    closeModal(evt.currentTarget);
  }
}

export { openModal, closeModal, handleModalCloseClick };
