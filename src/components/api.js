const config = {
  baseUrl: "https://nomoreparties.co/v1/wff-cohort-8",
  headers: {
    authorization: "81d268ed-275e-46cb-9df4-c6240e8f0775",
    "Content-Type": "application/json",
  },
};

/**
 * Выполняет запрос указанного URL с заданными параметрами.
 * 
 * @param {string} url - URL для выполнения запроса.
 * @param {Object} options - Параметры для запроса fetch.
 * @returns {Promise} - Промис, который разрешается в ответ на запрос fetch.
 */
const makeRequest = (url, options) => {
  return fetch(url, options)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    });
};

const getProfile = () => {
  return makeRequest(`${config.baseUrl}/users/me`, { headers: config.headers });
};

const getInitialCards = () => {
  return makeRequest(`${config.baseUrl}/cards`, { headers: config.headers });
};

const updateProfile = ({ name, about }) => {
  return makeRequest(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({ name, about }),
  });
};

const createCard = ({ name, link }) => {
  return makeRequest(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({ name, link }),
  });
};

const deleteCard = (id) => {
  return makeRequest(`${config.baseUrl}/cards/${id}`, {
    method: "DELETE",
    headers: config.headers,
  });
};

const addLike = (id) => {
  return makeRequest(`${config.baseUrl}/cards/likes/${id}`, {
    method: "PUT",
    headers: config.headers,
  });
};

const removeLike = (id) => {
  return makeRequest(`${config.baseUrl}/cards/likes/${id}`, {
    method: "DELETE",
    headers: config.headers,
  });
};

const updateAvatar = ({ avatar }) => {
  return makeRequest(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({ avatar }),
  });
};

export {
  getProfile,
  updateProfile,
  getInitialCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
  updateAvatar,
};
