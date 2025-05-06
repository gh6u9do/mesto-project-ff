// подключаем массив с данными карточки
import { initialCards } from "./cards.js";
// @todo: Темплейт карточки
// @todo: DOM узлы
// @todo: Функция создания карточки
function createCard(cardData, deleteCard) {
  // копируем шаблон 
  const cardTemplate = document.querySelector("#card-template").content;
  const newCard = cardTemplate.cloneNode(true);

  // устанавливаем название карточки и атрибуты img
  const cardTitle = newCard.querySelector(".card__title");
  cardTitle.textContent = cardData.name;
  const cardImage = newCard.querySelector(".card__image");
  cardImage.setAttribute("src", cardData.link);
  cardImage.setAttribute("alt", cardData.name);

  // устанавливаем обработчик удаления карточки
  const deleteButton = newCard.querySelector(".card__delete-button");
  deleteButton.addEventListener("click", (e) => {
    deleteCard(e.target);
  });

  return newCard;
}

// @todo: Функция удаления карточки
function deleteCard(element) {
  element.parentElement.remove();
}

// проходим по массиву и пушим карточки
const placesList = document.querySelector(".places__list");
initialCards.forEach((value) => {
  const createdCard = createCard(value, deleteCard);
  placesList.append(createdCard);
});
