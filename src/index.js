import initialCards from "./components/cards.js";
import { createCardDOM, deleteCard, likeCard } from "./components/card.js";
import { openModal, closeModal } from "./components/modal.js";

// Import CSS file
import "./pages/index.css";

// Import specified image files
import "./images/logo.svg";
import "./images/avatar.jpg";

const placesList = document.querySelector(".places__list");

const popupEditProfile = document.querySelector(".popup_type_edit");
const popupAddCard = document.querySelector(".popup_type_new-card");

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

// Обработчик клика по изображению карточки.
function showImage(evt) {
  popupImage.src = evt.target.src;
  popupImage.alt = evt.target.alt;
  popupCaption.textContent = evt.target.alt;

  openModal(popupTypeImage);
}

// Обработчик отправки формы редактирования профиля.
function handleEditProfileFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = profileNameInput.value;
  profileDesc.textContent = profileDescInput.value;
  closeModal(popupEditProfile);
}

// Обработчик отправки формы добавления новой карточки.
function handleNewPlaceFormSubmit(evt) {
  evt.preventDefault();

  const newCard = createCardDOM(
    {
      name: newPlaceNameInput.value,
      link: newPlaceLinkInput.value,
    },
    deleteCard,
    likeCard,
    showImage
  );
  placesList.prepend(newCard);

  closeModal(popupAddCard);
}

// Отображение начальных карточек на странице.
function showInitialCards() {
  const cardsDOM = initialCards.map((cardData) => {
    return createCardDOM(cardData, deleteCard, likeCard, showImage);
  });

  placesList.append(...cardsDOM);
}

showInitialCards();

// Открывать модальное окно редактирования профиля по клику на кнопку "Редактировать"
document
  .querySelector(".profile__edit-button")
  .addEventListener("click", () => {
    openModal(popupEditProfile);
    profileNameInput.value = profileName.textContent;
    profileDescInput.value = profileDesc.textContent;
  });

// Открывать модальное окно добавления новой карточки по клику на кнопку [+]
document.querySelector(".profile__add-button").addEventListener("click", () => {
  newPlaceForm.reset();
  openModal(popupAddCard);
});

// Закрывать модальные окна по клику на оверлей или кнопку [X]
document.querySelectorAll(".popup").forEach((popup) => {
  popup.addEventListener("click", (evt) => {
    if (
      evt.target.classList.contains("popup") ||
      evt.target.classList.contains("popup__close")
    ) {
      closeModal(popup);
    }
  });
});

profileForm.addEventListener("submit", handleEditProfileFormSubmit);
newPlaceForm.addEventListener("submit", handleNewPlaceFormSubmit);
