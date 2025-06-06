// подключаем стили для вебпака
import "../pages/index.css";

// спасибо за ревью!!!

// подключаем массив с данными карточки
import { initialCards } from "./cards.js";
// подключаем функции для работы с карточками
import { createCard, setLikeCard, getCardInfo } from "../components/card.js";
// подключаем функции для работы с попапами
import { openModal, closeModal, getActivityPopup } from "../components/modal.js";



// проходим находим лист в котором должны быть карточки
const placesList = document.querySelector(".places__list");
// проходим по массиву и пушим карточки
initialCards.forEach((value) => {
  const createdCard = createCard(value, setLikeCard, openCardInViewMode);
  addCardOnList(placesList, createdCard);
});


// находим все попапы
export const popups = {
  edit: document.querySelector(".popup_type_edit"),
  newCard: document.querySelector(".popup_type_new-card"),
  image: document.querySelector(".popup_type_image"),
};

// даем всем попапам анимацию и вешаем обработчик закрытия
for(let key in popups) {
  popups[key].classList.add('popup_is-animated');
  popups[key].querySelector('.popup__close').addEventListener('click', (e) => {
    closeModal(popups[key]);
  });
}



// находим кнопку реадктирования профиля
const editProfileBtn = document.querySelector(".profile__edit-button");
// устанавливаем обработчик на кнопку редактирования
editProfileBtn.addEventListener("click", (e) => {
  setCurrentDataInEditPopup({name: profileName, description: profileDescription});
  openModal(popups.edit);
});

// функция устанавливает значения из профиля в попапе
function setCurrentDataInEditPopup(fieldsObj) {
  // перебираем объект и пушим текст из полей объекта в форму
  for(let key in fieldsObj) {
    editForm.elements[key].value = fieldsObj[key].textContent;
  }
}

// находим кнопку добавления новой карточки
const addNewCardButton = document.querySelector(".profile__add-button");
// устанавливаем обработчик на кнопку добавления
addNewCardButton.addEventListener("click", (e) => {
  // очищаем форму 
  newPlaceForm.reset();
  // открываем попап добавления новой карточки
  openModal(popups.newCard);
});



// достаем форму редактирования профиля
const editForm = document.forms["edit-profile"];
// устанавливаем обработчик submit
editForm.addEventListener('submit', (e) => {
  // отменяем базовую отправку формы
  e.preventDefault();
  // пакуем поля формы в объект
  const profileFields= {name: profileName, description: profileDescription};
  // ставим данные в поля профиля 
  setDataInProfile(editForm.elements, profileFields);
  // закрываем попап
  closeModal(getActivityPopup());
})

// находим редактируемые поля профиля
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

// функция устанавливает значения в профиле из попапа
function setDataInProfile(data, profileFields) {
  // перебираем объект с полями и заполняем их новыми данными
  for(let key in profileFields) {
    profileFields[key].textContent = data[key].value;
  }
}



// достаем форму добавления новой карточки 
const newPlaceForm = document.forms['new-place'];
// устанавливаем обработчик submit
newPlaceForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // крафтим объект с данными для создания карточки
  const cardData = { 
    name: newPlaceForm.elements['place-name'].value,
    link: newPlaceForm.elements['link'].value
  } 

  // создаем элемент карточки
  const newCard = createCard(cardData, setLikeCard, openCardInViewMode);
  // добавляем карточку 
  addCardOnList(placesList, newCard, "begin");

  // закрываем окно
  closeModal(getActivityPopup());
  // очищаем форму
  newPlaceForm.reset();
})



// функция добавления карточки в список
function addCardOnList(list, card, position = "end") {
  if(position == "begin") {
    list.prepend(card);
  } else if( position == "end") {
    list.append(card);
  }
}

// функция открывает карточку в режиме просмотра
function openCardInViewMode(e) {
  // получаем данные карточки и кладем их в попап
  const cardData = getCardInfo(e);
  setDataInImagePopup(cardData);
  openModal(popups.image);
}

// находим поля попапа картинки
const popupCaptionField = popups.image.querySelector('.popup__caption');
const popupImageField = popups.image.querySelector('.popup__image');

// функция устанавливает данные в попап image
export function setDataInImagePopup(data) {
  popupCaptionField.textContent = data.caption;
  popupImageField.alt = data.caption;
  popupImageField.src = data.src;
}