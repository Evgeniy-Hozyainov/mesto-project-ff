const cardTemplate = document.getElementById("card-template").content;

/**
 * Создание DOM элемента карточки.
 *
 * @param {Object} cardData - Объект с данными карточки. 
 * @param {Function} fnDeleteCard - Функция, которая будет вызвана при клике на кнопку удаления карточки.
 * @param {Function} fnLikeCard - Функция, которая будет вызвана при клике на кнопку "лайка" карточки.
 * @param {Function} fnShowImage - Функция, которая будет вызвана при клике на изображение карточки.
 * @param {string} userId - ID текущего пользователя.
 * @returns {HTMLElement} Возвращает DOM элемент карточки.
 */
function createCardDOM(cardData, fnDeleteCard, fnLikeCard, fnShowImage, userId) {
  const { _id, name, link, likes, owner } = cardData;

  const card = cardTemplate.querySelector(".card").cloneNode(true);
  card.dataset.cardId = _id;

  const img = card.querySelector(".card__image");
  img.src = link;
  img.alt = name;

  const cardLikeButton = card.querySelector(".card__like-button");

  card.querySelector(".card__title").textContent = name;
  card.querySelector(".card__likes-count").textContent = likes.length;
  cardLikeButton.addEventListener("click", fnLikeCard);
  card.querySelector(".card__image").addEventListener("click", fnShowImage);

  // Если текущий пользователь уже "лайкнул" эту карточку,
  // то добавляем класс "card__like-button_is-active" к кнопке "лайк",
  // чтобы визуально отобразить, что карточка "лайкнута".
  if (cardData.likes.some((like) => like._id === userId)) {
    cardLikeButton.classList.add("card__like-button_is-active");
  }

  // Проверим, принадлежит ли карточка текущему пользователю.
  // Удалять карточку может только тот пользователь, который её создал.
  const cardDeleteButton = card.querySelector(".card__delete-button")
  if (owner._id === userId) {    
    cardDeleteButton.addEventListener("click", fnDeleteCard);    
  } else {
    cardDeleteButton.remove();
  }

  return card;
}

// Обработчик удаления карточки.
function deleteCard(cardId) {
  const card = document.querySelector(`[data-card-id="${cardId}"]`);
  card.remove();
}

// Обработчик клика по "лайку" карточки.
function likeCard(evt) {
  evt.target.classList.toggle("card__like-button_is-active");
}

export { createCardDOM, deleteCard, likeCard };
