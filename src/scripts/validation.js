// файл содержит функции валидации полей формы

// функция показывает сообщение об ошибке
export function showInputError(
  formElement,
  formInput,
  errorMessage,
  errorClass,
  inputErrorClass
) {
  // находим блок с сообщением об ошибке
  const errorBlock = formElement.querySelector(`.${formInput.id}-error`);
  formInput.classList.add(`${inputErrorClass}`);
  // находим сообщение об ошибке и показываем его
  errorBlock.classList.add(`${errorClass}`);
  // ставим текст ошибки
  errorBlock.textContent = errorMessage;
}

// функция скрывает сообщение об ошибке
export function hideInputError(
  formElement,
  formInput,
  inputErrorClass,
  errorClass
) {
  // убираем стили некорректного поля
  formInput.classList.remove(`${inputErrorClass}`);
  // находим блок с сообщением об ошибке
  const errorBlock = formElement.querySelector(`.${formInput.id}-error`);
  // убираем сообщение об ошибке
  errorBlock.classList.remove(`${errorClass}`);
  errorBlock.textContent = " ";
}

// функция проверяет валидность одного инпута на форме
export function isValid(formElement, formInput, errorClass, inputErrorClass) {
  // console.log("вызвали isValid");
  // если ошибка из-за несоответствия паттерну
  if (formInput.validity.patternMismatch) {
    formInput.setCustomValidity(formInput.dataset.errorMessage);
  } else {
    // очищаем для отображения стандартных браузерных сообщений
    formInput.setCustomValidity("");
  }

  if (!formInput.validity.valid) {
    showInputError(
      formElement,
      formInput,
      formInput.validationMessage,
      errorClass,
      inputErrorClass
    );
  } else {
    hideInputError(formElement, formInput, inputErrorClass, errorClass);
  }
}

// функция устанавливает обработчики на все формы
export function enableValidation({
  formSelector,
  inputSelector,
  submitButtonSelector,
  // класс для отображения неактивной кнопки
  inactiveButtunClass,
  // класс для подсвечивания неправильного инпута
  inputErrorClass,
  // класс делает видимым сообщение об ошибке
  errorClass,
}) {
  // находим все формы
  const formList = Array.from(document.querySelectorAll(`.${formSelector}`));

  // перебираем коллекцию форм
  formList.forEach((form) => {
    setValidateListeners(
      form,
      inputSelector,
      submitButtonSelector,
      errorClass,
      inactiveButtunClass,
      inputErrorClass
    );
  });
}

// функция устанавливает обработчики на все инпуты внутри одной формы
function setValidateListeners(
  formElement,
  inputSelector,
  submitButtonSelector,
  errorClass,
  inactiveButtunClass,
  inputErrorClass
) {
  // находим все инпуты
  const inputList = Array.from(
    formElement.querySelectorAll(`.${inputSelector}`)
  );
  // находим кнопку отправки внутри формы
  const submitButton = formElement.querySelector(`.${submitButtonSelector}`);
  toggleButtonState(inputList, submitButton, inactiveButtunClass);

  // перебираем колекцию инпутов и назначаем валидацию
  inputList.forEach((input) => {
    input.addEventListener("input", (e) => {
      // проверяем валидность при каждом вводе
      isValid(formElement, input, errorClass, inputErrorClass);

      // переключаем состояние кнопки
      toggleButtonState(inputList, submitButton, inactiveButtunClass);
    });
  });
}

function hasInvalidInput(inputList) {
  // проверяем на наличие хотя бы одного невалидного поля
  return inputList.some((input) => {
    // проверяем валидность инпута
    return !input.validity.valid;
  });
}

export function toggleButtonState(
  inputList,
  buttonElement,
  inactiveButtunClass
) {
  // чекаем на невалид
  if (hasInvalidInput(inputList)) {
    // отключаем кнопку
    buttonElement.disabled = true;
    buttonElement.classList.add(`${inactiveButtunClass}`);
  } else {
    // делаем кнопку активной
    buttonElement.disabled = false;
    buttonElement.classList.remove(`${inactiveButtunClass}`);
  }
}

// функция очищает ошибки формы и делает кнопку неактивной
export function clearValidation(
  formElement,
  {
    inputSelector,
    submitButtonSelector,
    inactiveButtunClass,
    inputErrorClass,
    errorClass,
  }
) {
  // console.log("вызвали clearValidation");
  // находим поля на форме
  const inputList = Array.from(
    formElement.querySelectorAll(`.${inputSelector}`)
  );
  inputList.forEach((inputElement) => {
    // удаляем класс ошибки с инпута
    inputElement.classList.remove(`${inputErrorClass}`);
    // очищаем сообщение об ошибке
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    errorElement.textContent = "";
    errorElement.classList.remove(`${errorClass}`);
  });

  // делаем кнопку неактивной
  const buttonElement = formElement.querySelector(`.${submitButtonSelector}`);
  toggleButtonState(inputList, buttonElement, inactiveButtunClass);
}
