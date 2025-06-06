// здесь все функции для работы с попапами 

// переменная хранит активный попап
let activityPopup = "";

// функция возвращает активный попап
export function getActivityPopup() {
  return activityPopup;
}

// функция показывает попап
export function openModal(popup) {
  // записываем активный popup
  activityPopup = popup;
  // показываем попап
  popup.classList.add("popup_is-opened");
  // добавляем обработчик для закрытия по нажатию на клавишу (esc)
  document.addEventListener("keydown", closeModalWithKeydown);
  document.addEventListener('click', closeModalWithOverlay);
}

// функция закрывает попап
export function closeModal(popup) {
  // скрываем попап
  popup.classList.remove("popup_is-opened");
  // удаляем обработчик чтобы он не стакался
  popup.querySelector(".popup__close").removeEventListener("click", closeModal);
  // убираем слушатель кнопки 
  document.removeEventListener("keydown", closeModalWithKeydown);
  // убираем слушатель клика по оверлею
  document.removeEventListener("click", closeModalWithOverlay);
  // очищаем переменную с активным попапом
  activityPopup = "";
}

// функция обрабатывает нажатие клавиши 
export function closeModalWithKeydown(e) {
  if (e.key === "Escape") {
    closeModal(getActivityPopup());
  }
}

// функция обрабтывает клик по оверлею
function closeModalWithOverlay(e) {
  if (e.target.classList.contains("popup")) {
    closeModal(getActivityPopup());
  }
}