// в этом файле функции для работы с API

// объект с настройками
const config = {
  baseUrl: "https://nomoreparties.co/v1/wff-cohort-41",
  headers: {
    authorization: "9719e452-070c-494e-b12d-d71aadf8bee8",
    "Content-Type": "application/json",
  },
};

// функция возвращает данные о пользователе
export function getUserData() {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers,
  })
    .then((res) => {
      if(res.ok){
        return res.json()
      } else {
        Promise.reject(`Ошибка: ${res.status}`);
      }
    })
    .then((res) => {
      return res;
    })
    .catch((err) => console.log(err));
}

// функция возвращает карточки
export function getCards() {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        Promise.reject("Ошибка: " + res.status);
      }
    })
    .then((res) => {
      // console.log(res)
      return res;
    })
    .catch((err) => console.log(err));
}

// функция отправляет обновленные данные о профиле на сервер
export function sendUpdateUserData(userData) {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      name: userData.name.textContent,
      about: userData.description.textContent,
    }),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        Promise.reject(`Ошибка: ${res.status}`);
      }
    })
    .then((res) => {
      return res;
    })
    .catch((err) => console.log(err));
}

// добавляем новую карточку на сервер
export function sendCard(name, link) {
  return fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({
      name: name,
      link: link,
    }),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        Promise.reject(`Ошибка: ${res.status}`);
      }
    })
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch((err) => console.log(err));
}

// удаляем карточку на сервере
export function deleteCardOnServer(cardId) {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        Promise.reject(`Ошибка: ${res.status}`);
      }
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
    });
}

// функция меняет статус лайка у карточки
export function toggleLikeCardStatusOnServer(action, cardId) {
  // в зависимости от нужного действия воввращаем нужный fetch
  if (action == "like") {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
      method: "PUT",
      headers: config.headers,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          Promise.reject(`Ошибка: ${res.status}`);
        }
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (action == "unlike") {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
      method: "DELETE",
      headers: config.headers,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          Promise.reject(`Ошибка: ${res.status}`);
        }
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

// функция меняет аватарку пользователя на сервере
export function changeAvatarOnServer(avatarUrl) {
  console.log(avatarUrl);
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({ avatar: avatarUrl }),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        Promise.reject(`Ошибка: ${res.status}`);
      }
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
    });
}
