// в этом модуле хранится логика для работы с карточками

import { setDataInImagePopup, openModal, popups } from "./modal";

// Функция удаления карточки
export function deleteCard(element) {
  element.parentElement.remove();
}

// Функция создания карточки
export function createCard(cardData, likeHandler, viewHandler) {
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

  // устанавливаем обработчик лайка карточки
  const likeButton = newCard.querySelector('.card__like-button');
  likeButton.addEventListener('click', (e) => {
    likeHandler(e.target); 
  });

  // устанавливаем обработчик клика на картинку
  cardImage.addEventListener('click', (e) => {
    viewHandler(e);
  })

  return newCard;
}

// функция добавления карточки в список
export function addCardOnList(list, card, position = "end") {
  if(position == "begin") {
    list.prepend(card);
  } else if( position == "end") {
    list.append(card);
  }
}

// функция лайка карточки
export function setLikeCard(target) {
  // если карточка уже лайкнута - убираем лайк
  if(target.classList.contains('card__like-button_is-active')) {
    target.classList.remove('card__like-button_is-active');
  } else {
    // в ином случае добавляем лайк
    target.classList.add('card__like-button_is-active');
  }
}

// функция возвращает объект с данными для попапа image
function getCardInfo(e) {
  // получаем саму карточку по которой кликнули
  const card = e.target.closest('.card');

  // крафтим объект с данными
  const cardData = {
    caption: card.querySelector('.card__title').textContent,
    src: card.querySelector('.card__image').src,
  }

  return cardData;
}

// функция открывает карточку в режиме просмотра
export function openCardInViewMode(e) {
  // получаем данные карточки и кладем их в попап
  const cardData = getCardInfo(e);
  setDataInImagePopup(cardData);
  openModal(popups.image);
}
