import { createCardDOM, deleteCard, likeCard } from "./components/card.js";
import {
  openModal,
  closeModal,
  handleModalCloseClick,
} from "./components/modal.js";
import { enableValidation, clearValidation } from "./validation.js";
import * as api from "./api.js";

// Import CSS file
import "./pages/index.css";

// Import specified image files
import "./images/logo.svg";
import "./images/avatar.jpg";

// ID удаляемой карточки
let deletedCardId = null;

const placesList = document.querySelector(".places__list");

const popupEditProfile = document.querySelector(".popup_type_edit");
const popupAddCard = document.querySelector(".popup_type_new-card");

let userId = null;

const profileImage = document.querySelector(".profile__image");
const profileName = document.querySelector(".profile__title");
const profileDesc = document.querySelector(".profile__description");

const profileForm = document.forms["edit-profile"];
const profileNameInput = profileForm.elements["name"];
const profileDescInput = profileForm.elements["description"];

const newPlaceForm = document.forms["new-place"];
const newPlaceNameInput = newPlaceForm.elements["place-name"];
const newPlaceLinkInput = newPlaceForm.elements["link"];

const popupTypeImage = document.querySelector(".popup_type_image");
const popupImage = popupTypeImage.querySelector(".popup__image");
const popupCaption = popupTypeImage.querySelector(".popup__caption");

const popupUpdateAvatar = document.querySelector(".popup_type_avatar");
const updateAvatarForm = document.forms["update-avatar"];

const popupDelete = document.querySelector(".popup_type_delete");
const deleteConfirmationForm = document.forms["delete-confirmation"];

// Объект конфигурации валидации.
// Содержит селекторы и классы, используемые для валидации форм.
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// Обработчик клика по изображению карточки.
function showImage(evt) {
  popupImage.src = evt.target.src;
  popupImage.alt = evt.target.alt;
  popupCaption.textContent = evt.target.alt;

  openModal(popupTypeImage);
}

/**
 * Функция обработки отправки формы,
 * выполняет API-метод с переданными данными,
 * обновляет UI в случае успеха и закрывает модальное окно.
 *
 * @param {Event} evt - Событие отправки формы.
 * @param {Function} apiMethod - API-метод для выполнения.
 * @param {Object|string} data - Данные для передачи в API-метод.
 * @param {Function} onSuccess - Функция, вызываемая при успешном выполнении API-метода.
 * @param {Function} closeModalFunc - Функция для закрытия модального окна.
 * @param {string} loadingText - Текст кнопки во время выполнения запроса данных.
 */
function handleFormSubmit(
  evt,
  apiMethod,
  data,
  onSuccess,
  closeModalFunc,
  loadingText = "Сохранение..."
) {
  evt.preventDefault();

  const submitButton = evt.target.querySelector(
    validationConfig.submitButtonSelector
  );
  const defaultSubmitButtonText = submitButton.textContent;

  // Блокируем кнопку отправки формы и меняем её текст,
  // пока идёт загрузка данных.
  submitButton.textContent = loadingText;
  submitButton.disabled = true;

  apiMethod(data)
    .then(onSuccess)
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      closeModalFunc();
      // Разблокируем кнопку отправки формы
      // и меняем её текст, после загрузки данных.
      submitButton.textContent = defaultSubmitButtonText;
      submitButton.disabled = false;
    });
}

// Обработчик отправки формы редактирования профиля.
function handleEditProfileFormSubmit(evt) {
  handleFormSubmit(
    evt,
    api.updateProfile,
    {
      name: profileNameInput.value,
      about: profileDescInput.value,
    },
    ({ name, about }) => {
      profileName.textContent = name;
      profileDesc.textContent = about;
    },
    () => closeModal(popupEditProfile)
  );
}

// Обработчик отправки формы добавления новой карточки.
function handleNewPlaceFormSubmit(evt) {
  handleFormSubmit(
    evt,
    api.createCard,
    {
      name: newPlaceNameInput.value,
      link: newPlaceLinkInput.value,
    },
    (cardData) => {
      const newCard = createCardDOM(
        cardData,
        deleteCardWithConfirmation,
        toggleCardLikeStatus,
        showImage,
        userId
      );
      placesList.prepend(newCard);
    },
    () => closeModal(popupAddCard)
  );
}

// Обработчик отправки формы обновления аватара.
function handleUpdateAvatarFormSubmit(evt) {
  handleFormSubmit(
    evt,
    api.updateAvatar,
    { avatar: updateAvatarForm.elements["link"].value },
    ({ avatar }) => {
      profileImage.style.backgroundImage = `url(${avatar})`;
    },
    () => closeModal(popupUpdateAvatar)
  );
}

// Обработчик отправки формы подтверждения удаления карточки.
function handleDeleteConfirmationFormSubmit(evt) {
  handleFormSubmit(
    evt,
    api.deleteCard,
    deletedCardId,
    ({ message }) => {
      deleteCard(deletedCardId);
    },
    () => closeModal(popupDelete),
    "Удаление..."
  );
}

// Обработчик клика по иконке удаления карточки
function deleteCardWithConfirmation(evt) {
  deletedCardId = evt.target.closest(".card").dataset.cardId;
  openModal(popupDelete);
}

// Обработчик клика по кнопке "лайк" на карточке.
function toggleCardLikeStatus(evt) {
  const card = evt.target.closest(".card");
  const isLiked = evt.target.classList.contains("card__like-button_is-active");
  const apiMethod = isLiked ? api.removeLike : api.addLike;

  apiMethod(card.dataset.cardId)
    .then((cardData) => {
      card.querySelector(".card__likes-count").textContent =
        cardData.likes.length;
      likeCard(evt);
    })
    .catch((err) => {
      console.log(err);
    });
}

// Отображение начальных карточек на странице.
function showInitialCards(cards) {
  const cardsDOM = cards.map((cardData) => {
    return createCardDOM(
      cardData,
      deleteCardWithConfirmation,
      toggleCardLikeStatus,
      showImage,
      userId
    );
  });

  placesList.append(...cardsDOM);
}

// Открывать модальное окно редактирования профиля
// по клику на кнопку "Редактировать"
document
  .querySelector(".profile__edit-button")
  .addEventListener("click", () => {
    clearValidation(profileForm, validationConfig);
    profileNameInput.value = profileName.textContent;
    profileDescInput.value = profileDesc.textContent;
    openModal(popupEditProfile);
  });

// Открывать модальное окно добавления новой карточки
// по клику на кнопку [+]
document.querySelector(".profile__add-button").addEventListener("click", () => {
  newPlaceForm.reset();
  clearValidation(newPlaceForm, validationConfig);
  openModal(popupAddCard);
});

// Открывать модальное окно обновления аватара
// по клику на аватар пользователя
document.querySelector(".profile__image").addEventListener("click", () => {
  updateAvatarForm.reset();
  clearValidation(popupUpdateAvatar, validationConfig);
  openModal(popupUpdateAvatar);
});

// Закрывать модальные окна по клику на оверлей или кнопку [X]
document.querySelectorAll(".popup").forEach((popup) => {
  popup.addEventListener("click", handleModalCloseClick);
});

// Добавим обработчики отправки форм
profileForm.addEventListener("submit", handleEditProfileFormSubmit);
newPlaceForm.addEventListener("submit", handleNewPlaceFormSubmit);
updateAvatarForm.addEventListener("submit", handleUpdateAvatarFormSubmit);
deleteConfirmationForm.addEventListener("submit", handleDeleteConfirmationFormSubmit);

// Функция обновления в DOM информации профиля.
// Принимает объект с информацией о пользователе.
// ID пользователя сохраняется в глобальной переменной userId.
function updateProfileInfo({ name, about, avatar, _id }) {
  userId = _id;
  profileName.textContent = name;
  profileDesc.textContent = about;
  profileImage.style.backgroundImage = `url(${avatar})`;
}

// Активируем валидацию форм в соответствии с переданными параметрами.
enableValidation(validationConfig);

Promise.all([api.getProfile(), api.getInitialCards()])
  .then(([profileInfo, initialCards]) => {
    updateProfileInfo(profileInfo);
    showInitialCards(initialCards);
  })
  .catch((err) => {
    console.log(err);
  });
