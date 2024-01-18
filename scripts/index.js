// @todo: Темплейт карточки
const cardTemplate = document.getElementById('card-template').content

// @todo: DOM узлы
const placesList = document.querySelector('.places__list')

// @todo: Функция создания карточки
function createCardDOM({ name, link }, fnDeleteCard) {
    const card = cardTemplate.querySelector('.card').cloneNode(true)
    card.querySelector('.card__image').src = link
    card.querySelector('.card__title').textContent = name
    card.querySelector('.card__delete-button').addEventListener('click', fnDeleteCard)

    return card
}

// @todo: Функция удаления карточки
function deleteCard(evt) {
    evt.target.closest('.card').remove();
}

// @todo: Вывести карточки на страницу
function showInitialCards() {
    const cardsDOM = initialCards.map(cardData => {
        return createCardDOM(cardData, deleteCard)
    })

    placesList.append(...cardsDOM)
}

showInitialCards()