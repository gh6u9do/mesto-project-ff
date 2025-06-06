// в этом модуле хранится логика для работы с карточками

// Функция удаления карточки
export function deleteCard(element) {
  element.parentElement.remove();
}

// Функция создания карточки
export function createCard(cardData, likeHandler, viewHandler) {
  // копируем шаблон
  const cardTemplate = document.querySelector("#card-template").content;
  const newCard = cardTemplate.querySelector('.card').cloneNode(true);

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

// функция лайка карточки
export function setLikeCard(target) {
  // переключаем класс с лайком
  target.classList.toggle('card__like-button_is-active');
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
