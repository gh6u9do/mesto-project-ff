// подключаем стили для вебпака
import "../pages/index.css";

// спасибо за ревью!
// p.s. прошу прощения, что не заметил все сразу

// подключаем функции для работы с карточками
import { createCard, setLikeCard, getCardInfo } from "../components/card.js";
// подключаем функции для работы с попапами
import {
  openModal,
  closeModal,
  getActivityPopup,
} from "../components/modal.js";
import {
  clearValidation,
  enableValidation,
  isValid,
  toggleButtonState,
} from "./validation.js";
import {
  changeAvatarOnServer,
  getCards,
  getUserData,
  sendCard,
  sendUpdateUserData,
} from "./api.js";

// находим все попапы
export const popups = {
  edit: document.querySelector(".popup_type_edit"),
  newCard: document.querySelector(".popup_type_new-card"),
  image: document.querySelector(".popup_type_image"),
  avatar: document.querySelector(".popup_type_avatar"),
};

// находим все элементы профиля
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileImage = document.querySelector(".profile__image");

// объявляем переменную для userDataFromServer
let profileDataFromServer = "";
// объявляем переменную для cardFromServer
let cardsFromServer = "";

// находим лист в котором должны быть карточки
const placesList = document.querySelector(".places__list");

// получаем с сервера информацию о пользователе и карточки
Promise.all([getUserData(), getCards()])
  .then(([userData, cards]) => {
    // записываем ответ сервера в переменные
    profileDataFromServer = userData;
    cardsFromServer = cards;

    // устанавливаем серверные данные в профиль
    setProfileDataFromServer(profileDataFromServer, {
      name: profileName,
      about: profileDescription,
      avatar: profileImage,
    });

    // создаем карточки
    cardsFromServer.forEach((cardData) => {
      // создаем экзмепляр карточки
      const newCard = createCard(
        profileDataFromServer._id,
        cardData,
        setLikeCard,
        openCardInViewMode
      );
      // кладем карточку в лист
      addCardOnList(placesList, newCard);
    });
  })
  .catch((err) => console.log(err));

// даем всем попапам анимацию и вешаем обработчик закрытия
for (let key in popups) {
  popups[key].classList.add("popup_is-animated");
  popups[key].querySelector(".popup__close").addEventListener("click", (e) => {
    closeModal(popups[key]);
  });
}

const validationConfig = {
  inputSelector: "popup__input",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
  submitButtonSelector: "popup__button",
  inactiveButtunClass: "popup__button_disabled",
};

// находим кнопку обновления аватарки
const editAvatarBtn = document.querySelector(".profile__image");
// устанавливаем обработчик на аватарку
editAvatarBtn.addEventListener("click", (e) => {
  // при открытии очищаем поля формы
  popups.avatar.querySelector(".popup__form").reset();

  // вызываем очистку ошибок валидации
  clearValidation(popups.avatar, validationConfig);

  // открываем модалку
  openModal(popups.avatar);
});

// достаем форму смены аватарки
const changeAvatarForm = document.forms["change-avatar"];
// вешаем обработчик submit
changeAvatarForm.addEventListener("submit", async (e) => {
  // находим кнопку submit
  const submitButton = changeAvatarForm.querySelector(".popup__button");
  // записываем дефолтный текст кнопки
  const oldTextButton = submitButton.textContent;
  // показывваем на кнопке что идет сохранение
  submitButton.textContent = "Сохранение...";
  // отменяем дефолтную отправку формы
  e.preventDefault();
  // достаем значение из инпута
  const newAvatarUrl = changeAvatarForm.elements["avatar-link"].value;
  // отправляем новое значение на сервер
  try {
    await changeAvatarOnServer(newAvatarUrl);
    // устанавливаем новую аватарку на верстке в профиле
    profileImage.style.backgroundImage = `url(${newAvatarUrl})`;
    // закрываем модалку
    closeModal(getActivityPopup());
  } catch (err) {
    console.log(err);
  } finally {
    // возвращаем исходный текст кнопки
    submitButton.textContent = oldTextButton;
  }
});

// находим кнопку реадктирования профиля
const editProfileBtn = document.querySelector(".profile__edit-button");
// устанавливаем обработчик на кнопку редактирования
editProfileBtn.addEventListener("click", (e) => {
  // устанавливаем в попап текущие данные из профиля
  setCurrentDataInEditPopup({
    name: profileName,
    description: profileDescription,
  });

  // открываем модалку
  openModal(popups.edit);

  // очищаем от возможных ошибок валидации
  clearValidation(popups.edit, validationConfig);

  // заставляем браузер пересчитать значение valid для каждого инпута
  // (для того чтобы кнопка была не disable при валидных данных при открытии формы)
  const inputList = Array.from(popups.edit.querySelectorAll(".popup__input"));
  inputList.forEach((input) => {
    isValid(
      popups.edit,
      input,
      "popup__error_visible",
      "popup__input_type_error"
    );
  });
});

// функция устанавливает значения из профиля в попапе
function setCurrentDataInEditPopup(fieldsObj) {
  // перебираем объект и пушим текст из полей объекта в форму
  for (let key in fieldsObj) {
    editForm.elements[key].value = fieldsObj[key].textContent;
  }
}

// находим кнопку добавления новой карточки
const addNewCardButton = document.querySelector(".profile__add-button");
// устанавливаем обработчик на кнопку добавления
addNewCardButton.addEventListener("click", (e) => {
  // очищаем форму
  newPlaceForm.reset();
  // очищаем поля формы от возможных ошибок валидации
  clearValidation(popups.newCard, validationConfig);
  // открываем попап добавления новой карточки
  openModal(popups.newCard);
});

// вешаем валидацию на все формы
enableValidation({
  formSelector: "popup__form",
  inputSelector: "popup__input",
  submitButtonSelector: "popup__button",
  // класс для некликабельной кнопки
  inactiveButtunClass: "popup__button_disabled",
  // класс для подсвечивания неправильного инпута
  inputErrorClass: "popup__input_type_error",
  // класс делает видимым сообщение об ошибке
  errorClass: "popup__error_visible",
});

// достаем форму редактирования профиля
const editForm = document.forms["edit-profile"];
// устанавливаем обработчик submit
editForm.addEventListener("submit", async (e) => {
  // отменяем базовую отправку формы
  e.preventDefault();

  // находим кнопку submit
  const submitButton = editForm.querySelector(".popup__button");
  // записываем текст кнопки
  const oldButtonText = submitButton.textContent;
  // показываем пользователю что идет загрузка
  submitButton.textContent = "Сохранение...";

  // пакуем поля формы в объект
  const profileFields = { name: profileName, description: profileDescription };
  // отправляем новые данные о пользователе на сервер
  try {
    await sendUpdateUserData(profileFields);
    // ставим данные в поля профиля
    setDataInProfile(editForm.elements, profileFields);
    // закрываем попап
    closeModal(getActivityPopup());
  } catch (err) {
    console.log(err);
  } finally {
    // возвращаем исходный текст
    submitButton.textContent = oldButtonText;
  }
});

// функция устанавливает значения в профиле из попапа
function setDataInProfile(data, profileFields) {
  // перебираем объект с полями и заполняем их новыми данными
  for (let key in profileFields) {
    profileFields[key].textContent = data[key].value;
  }
}

// достаем форму добавления новой карточки
const newPlaceForm = document.forms["new-place"];
// устанавливаем обработчик submit
newPlaceForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // находим кнопку submit
  const submitButton = newPlaceForm.querySelector(".popup__button");
  // записываем старый текст кнопки в переменную
  const oldButtonText = submitButton.textContent;
  // показываем на кнопке что идет сохранение
  submitButton.textContent = "Сохранение...";

  // крафтим объект с данными для создания карточки
  const cardData = {
    name: newPlaceForm.elements["place-name"].value,
    link: newPlaceForm.elements["link"].value,
    likes: [],
    owner: {
      _id: profileDataFromServer._id,
    },
    cardId: "",
  };

  // объявляем переменную ответа сервера
  let serverResponse = "";

  // кладем карточку на сервер
  try {
    serverResponse = await sendCard(cardData.name, cardData.link);

    // дописываем id карточки из ответа сервера
    cardData._id = serverResponse._id;

    // создаем элемент карточки
    const newCard = createCard(
      profileDataFromServer._id,
      cardData,
      setLikeCard,
      openCardInViewMode
    );
    // добавляем карточку
    addCardOnList(placesList, newCard, "begin");
    // закрываем окно
    closeModal(getActivityPopup());
    // очищаем форму
    newPlaceForm.reset();
  } catch (err) {
    console.log(err);
  } finally {
    // возвращаем дефолтный текст
    submitButton.textContent = oldButtonText;
  }
});

// функция добавления карточки в список
function addCardOnList(list, card, position = "end") {
  if (position == "begin") {
    list.prepend(card);
  } else if (position == "end") {
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
const popupCaptionField = popups.image.querySelector(".popup__caption");
const popupImageField = popups.image.querySelector(".popup__image");

// функция устанавливает данные в попап image
export function setDataInImagePopup(data) {
  popupCaptionField.textContent = data.caption;
  popupImageField.alt = data.caption;
  popupImageField.src = data.src;
}

// функция устанавливает данные в профиль из сервера
function setProfileDataFromServer({ name, about, avatar }, profileFields) {
  profileFields.name.textContent = name;
  profileFields.about.textContent = about;
  profileFields.avatar.style.backgroundImage = `url(${avatar})`;
}
