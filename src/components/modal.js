// здесь все функции для работы с попапами 

// переменная хранит активный попап
let activityPopup = "";

// функция возвращает открытый попап
export function getActivityPopup() {
  return activityPopup;
}

// находим все попапы
export const popups = {
  edit: document.querySelector(".popup_type_edit"),
  newCard: document.querySelector(".popup_type_new-card"),
  image: document.querySelector(".popup_type_image"),
};

// даем всем попапам анимацию 
for(let key in popups) {
  popups[key].classList.add('popup_is-animated');
}



// функция показывает попап
export function openModal(popup) {
  // записываем активный попап
  activityPopup = popup;
  // показываем попап
  popup.classList.add("popup_is-opened");
  // добавляем функцию закрытия
  popup.querySelector(".popup__close").addEventListener("click", (e) => {
    closeModal(popup);
  });
  // добавляем обрабочтик для закрытия по клику на оверлей
  document.addEventListener("click", closeModalWithOverlay);
  // добавляем обработчик для закрытия по нажатию на клавишу (esc)
  document.addEventListener("keydown", closeModalWithKeydown);
}

// функция закрывает попап
export function closeModal(popup) {
  // скрываем попап
  popup.classList.remove("popup_is-opened");
  // удаляем обработчик чтобы он не стакался
  popup.querySelector(".popup__close").removeEventListener("click", closeModal);
  // очищаем переменную с активным попапом
  activityPopup = "";
}

// функция обрабатывает нажатие клавиши 
export function closeModalWithKeydown(e) {
  if (e.key === "Escape") {
    closeModal(activityPopup);
    document.removeEventListener("keydown", closeModalWithKeydown);
  }
}

// функция обрабтывает клик по оверлею
function closeModalWithOverlay(e) {
  if (e.target.classList.contains("popup")) {
    closeModal(activityPopup);
    document.removeEventListener("click", closeModalWithOverlay);
  }
}

// функция устанавливает данные в попап image
export function setDataInImagePopup(data) {
  popups.image.querySelector('.popup__caption').textContent = data.caption;
  popups.image.querySelector('.popup__image').src = data.src;
}
