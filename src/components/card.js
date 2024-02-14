const cardTemplate = document.getElementById("card-template").content;

/**
 * Создание DOM элемента карточки.
 *
 * @param {Object} cardData - Объект с данными карточки.
 * @param {string} cardData.name - Название карточки.
 * @param {string} cardData.link - Ссылка на изображение карточки.
 * @param {Function} fnDeleteCard - Функция, которая будет вызвана при клике на кнопку удаления карточки.
 * @param {Function} fnLikeCard - Функция, которая будет вызвана при клике на кнопку "лайка" карточки.
 * @param {Function} fnShowImage - Функция, которая будет вызвана при клике на изображение карточки.
 * @returns {HTMLElement} Возвращает DOM элемент карточки.
 */
function createCardDOM({ name, link }, fnDeleteCard, fnLikeCard, fnShowImage) {
  const card = cardTemplate.querySelector(".card").cloneNode(true);

  const img = card.querySelector(".card__image");
  img.src = link;
  img.alt = name;

  card.querySelector(".card__title").textContent = name;
  card.querySelector(".card__delete-button").addEventListener("click", fnDeleteCard);
  card.querySelector(".card__like-button").addEventListener("click", fnLikeCard);
  card.querySelector(".card__image").addEventListener("click", fnShowImage);

  return card;
}

// Обработчик удаления карточки.
function deleteCard(evt) {
  evt.target.closest(".card").remove();
}

// Обработчик клика по "лайку" карточки.
function likeCard(evt) {
  evt.target.classList.toggle("card__like-button_is-active");
}

export { createCardDOM, deleteCard, likeCard };
