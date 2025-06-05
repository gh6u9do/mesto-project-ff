// подключаем стили для вебпака
import "../pages/index.css";

// подключаем массив с данными карточки
import { initialCards } from "./cards.js";
// подключаем функции для работы с карточками
import { createCard, addCardOnList, setLikeCard, openCardInViewMode } from "../components/card.js";
// подключаем функции для работы с попапами
import { popups, openModal, closeModal, getActivityPopup } from "../components/modal.js";



// проходим находим лист в котором должны быть карточки
const placesList = document.querySelector(".places__list");
// проходим по массиву и пушим карточки
initialCards.forEach((value) => {
  const createdCard = createCard(value, setLikeCard, openCardInViewMode);
  addCardOnList(placesList, createdCard);
});



// находим кнопку реадктирования профиля
const editProfileBtn = document.querySelector(".profile__edit-button");
// устанавливаем обработчик на кнопку редактирования
editProfileBtn.addEventListener("click", (e) => {
  setCurrentDataInEditPopup(getProfileFields());
  openModal(popups.edit);
});



// находим кнопку добавления новой карточки
const addNewCardButton = document.querySelector(".profile__add-button");
// устанавливаем обработчик на кнопку добавления
addNewCardButton.addEventListener("click", (e) => {
  openModal(popups.newCard);
});



// достаем форму редактирования профиля
const editForm = document.forms["edit-profile"];
// устанавливаем обработчик submit
editForm.addEventListener('submit', (e) => {
  // отменяем базовую отправку формы
  e.preventDefault();
  // ставим данные в поля профиля 
  setDataInProfile(editForm.elements, getProfileFields());
  // закрываем попап
  closeModal(getActivityPopup());
})

// функция фозвращает объект с элементами профиля
function getProfileFields() {
  return {
    name: document.querySelector(".profile__title"),
    description: document.querySelector(".profile__description"),
  };
}

// функция устанавливает значения из профиля в попапе
function setCurrentDataInEditPopup(fieldsObj) {
  // перебираем объект и пушим текст из полей объекта в форму
  for(let key in fieldsObj) {
    editForm.elements[key].value = fieldsObj[key].textContent;
  }
}

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