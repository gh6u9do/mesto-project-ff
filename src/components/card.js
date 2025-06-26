// в этом модуле хранится логика для работы с карточками

import { deleteCardOnServer, toggleLikeCardStatusOnServer } from "../scripts/api";

// Функция удаления карточки
export async function deleteCard(element) {
  // находим саму карточку
  const cardElement = element.parentElement;
  // берем айди карточки из датасета
  const cardId = cardElement.dataset.cardId;
  // удаляем карточку по айди
  await deleteCardOnServer(cardId);
  // удаляем карточку на верстке
  cardElement.remove();
}

// Функция создания карточки
export function createCard(userId, cardData, likeHandler, viewHandler) {
  // console.log(cardData);
  // копируем шаблон
  const cardTemplate = document.querySelector("#card-template").content;
  const newCard = cardTemplate.querySelector('.card').cloneNode(true);

  // устанавливаем название карточки и атрибуты img
  const cardTitle = newCard.querySelector(".card__title");
  cardTitle.textContent = cardData.name;
  const cardImage = newCard.querySelector(".card__image");
  cardImage.setAttribute("src", cardData.link);
  cardImage.setAttribute("alt", cardData.name);

  // устанавливаем количество лайков
  const likeNum = newCard.querySelector('.card__like-num');
  likeNum.textContent = cardData.likes.length;

  // проверяем является ли пользователь создателем карточки
  const isOwner =  isCardOwner(userId, cardData);
  // если не создатель - убираем у карточки кнопку удаления
  if(!isOwner) {
    newCard.querySelector('.card__delete-button').remove();
  } else {
    // устанавливаем обработчик удаления карточки
    const deleteButton = newCard.querySelector(".card__delete-button");
    deleteButton.addEventListener("click", (e) => {
      deleteCard(e.target);
    });
  }
  // записываем в датасет айди карточки
  newCard.dataset.cardId = cardData._id;

  // устанавливаем обработчик лайка карточки
  const likeButton = newCard.querySelector('.card__like-button');
  likeButton.addEventListener('click', (e) => {
    likeHandler(e.target); 
  });

  // ищем айди юзера в массиве лайкнувших
  const isLiked = cardData.likes.find((value) => value._id == userId);
  // если картинка уже лайкнута (isLiked не undefined), добавляем класс на кнопку
  if(isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  }

  // устанавливаем обработчик клика на картинку
  cardImage.addEventListener('click', (e) => {
    viewHandler(e);
  })

  return newCard;
}

// функция лайка карточки
export async function setLikeCard(target) {
  // получаем элемент карточки
  const cardElement = target.closest('.card');
  const cardId = cardElement.dataset.cardId;
  // console.log(cardId); 

  // объявляем переменную с ответом сервера
  let serverAnswer = "";

  // чекаем лайкнута ли карточка
  if(target.classList.contains('card__like-button_is-active')){
    // записываем ответ сервера на дизлайк
    serverAnswer = await toggleLikeCardStatusOnServer('unlike', cardId);
  } else {
    // записываем ответ сервера на лайк
    serverAnswer = await toggleLikeCardStatusOnServer('like', cardId);
  }

  // переключаем класс с лайком
  target.classList.toggle('card__like-button_is-active');
  // находим элемент с количеством лайков
  const cardLikeNum = cardElement.querySelector('.card__like-num');
  // устанавливаем значение лайков из значения ответа сервера
  cardLikeNum.textContent = serverAnswer.likes.length;
}

// функция возвращает объект с данными для попапа image
export function getCardInfo(e) {
  // получаем саму карточку по которой кликнули
  const card = e.target.closest('.card');

  // крафтим объект с данными
  const cardData = {
    caption: card.querySelector('.card__title').textContent,
    src: card.querySelector('.card__image').src,
  }

  return cardData;
}

// функция проверяет является ли пользователь создателем карточки
function isCardOwner(userId, cardObj) {
  if(cardObj.owner._id == userId) {
    return true;
  } else {
    return false;
  }
}