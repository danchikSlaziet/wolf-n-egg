function HTMLredraw() {
  this.bodyWrap = document.querySelector('body');
  this.gameWrap = document.querySelector('#game-wrap');
  this.scoreWrap = document.querySelector('#score');
  this.messageWrap = document.querySelector('#message');
  this.startButton = document.querySelector('.first-page__button');
  this.scoreNums = 4;


  window.botToken = '6899155059:AAEaXDEvMiL7qstq_9BFQ59fEXGo-mcF1hU';
  window.userChatId = '';
  window.apiUrl = `https://api.telegram.org/bot${window.botToken}/sendMessage`;

  function parseQuery(queryString) {
    let query = {};
    let pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (let i = 0; i < pairs.length; i++) {
      let pair = pairs[i].split('=');
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
  }
  window.addEventListener('DOMContentLoaded', () => {
    let detect = new MobileDetect(window.navigator.userAgent);
    if (detect.os() === null) {
      document.querySelector('.page__is-pc').style.display = 'flex';
      console.log('PC');
    }

    let app = window.Telegram.WebApp;
    let query = app.initData;
    let user_data_str = parseQuery(query).user;
    let user_data = JSON.parse(user_data_str)
    app.expand();
    app.ready();
    window.userChatId = user_data["id"];
    console.log(window.userChatId);
    api.sendStatistics('открытие приложения', window.userChatId)
      .then(data => console.log(data))
      .catch(err => console.log(err));
  });

  class Api {
    constructor({baseUrl, secondUrl, thirdUrl, fourthUrl}) {
      this._baseUrl = baseUrl;
      this._secondUrl = secondUrl;
      this._thirdUrl = thirdUrl;
      this._fourthUrl = fourthUrl;
    }
  
    _getFetch(url, options) {
      return fetch(url, options)
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          return Promise.reject(`Ошибка ${res.status}`)
        });
    }
  
    sendStatistics(name, id) {
      const url = this._baseUrl + `?name=${name}&id=${id}`;
      const options = {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: '',
      }
      return this._getFetch(url, options);
    }
  
    sendFileId(id, fileId) {
      const params = {
        "id": id,
        "file_id": fileId
      }
      const url = this._secondUrl;
      const options = {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(params)
      }
      return this._getFetch(url, options);
    }
  
    postNumber(id, number) {
      const params = {
        "id": id,
        "number": number
      }
      const url = this._fourthUrl;
      const options = {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(params)
      }
      return this._getFetch(url, options);
    }
  
    getNumber(id) {
      const url = this._thirdUrl + `?id=${id}`;
      const options = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
      }
      return this._getFetch(url, options);
    }
  }
  
  const api = new Api({
    baseUrl: 'https://bukin.ilovebot.ru/api/statistics/',
    secondUrl: 'https://bukin.ilovebot.ru/api/user_tokens/',
    thirdUrl: 'https://bukin.ilovebot.ru/api/append_score/',
    fourthUrl: 'https://bukin.ilovebot.ru/api/rating/'
  });
}

HTMLredraw.prototype.updateEggPosition = function (data) {
  this.changeAttributesValue(['data-egg-' + data.egg], [data.position]);
};

HTMLredraw.prototype.updateBasketPosition = function (data) {
  this.changeAttributesValue(['data-bx', 'data-by'], [data.x, data.y]);
};

HTMLredraw.prototype.changeAttributesValue = function (attributes, values) {
  if (attributes instanceof Array && values instanceof Array && attributes.length == values.length) {
    for (var i = 0; i < attributes.length; i++) {
      this.gameWrap.setAttribute(attributes[i], values[i]);
    }
  }
};

HTMLredraw.prototype.updateScore = function (data) {
  var elements = this.scoreWrap.getElementsByTagName('li');
  var score = data.value.toString();
  var empty = (this.scoreNums - score.length);

  for (var i = 0; i < elements.length; i++) {
    var num = (i < empty) ? 0 : parseInt(score.charAt(i - empty));
    elements[i].className = 'n-' + num;
  }

  function activeBell() {
    if (!window.isGameOver) {
      document.querySelector('.page__bell-track').currentTime = 0;
      document.querySelector('.page__bell-track').play();
      document.querySelector('.bell').classList.add('bell_active');
  
      // Сохраняем идентификаторы интервала и таймаута
      const intervalIds = [];
      const timeoutIds = [];
  
      const intervalId = setInterval(() => {
        document.querySelector('.bell').classList.remove('bell_bottom');
        document.querySelector('.bell').classList.add('bell_top');
        const timeoutId = setTimeout(() => {
          document.querySelector('.bell').classList.remove('bell_top');
          document.querySelector('.bell').classList.add('bell_bottom');
        }, 70);
        // Сохраняем идентификатор таймаута
        timeoutIds.push(timeoutId);
      }, 300);
  
      // Сохраняем идентификатор интервала
      intervalIds.push(intervalId);
  
      setTimeout(() => {
        // Очищаем все интервалы
        intervalIds.forEach(clearInterval);
        // Очищаем все таймауты
        timeoutIds.forEach(clearTimeout);
  
        document.querySelector('.bell').classList.remove('bell_active');
        document.querySelector('.page__bell-track').pause();
      }, 2000);
    }
  }
  if (score === "4") {
    activeBell();
  }
  if (score === "10") {
    activeBell();
  }
  if (score === "24") {
    activeBell();
  }
  if (score === "40") {
    activeBell();
  }
  if (score === "50") {
    activeBell();
  }
  if (score === "60") {
    activeBell();
  }
  if (score === "100") {
    activeBell();
  }
  if (score === "200") {
    activeBell();
  }
};

HTMLredraw.prototype.updateLossCount = function (data) {
  this.changeAttributesValue(['data-loss'], [data.loss]);
};

HTMLredraw.prototype.gameOver = function () {
  // var msg = this.getMessage('Game Over');
  // this.messageWrap.show();
  // this.messageWrap.appendChild(msg);
  document.querySelector('.final-page').classList.remove('final-page_disabled');

  async function sendMessage(text) {
    // Формируем объект FormData для отправки текстового сообщения
    const formData = new FormData();
    formData.append('chat_id', window.userChatId);
    formData.append('text', text);

    // Отправка текстового сообщения на сервер Telegram
    try {
      console.log(window.botToken)
      const result = await fetch(window.apiUrl, {
        method: 'POST',
        body: formData,
      });
      // Check if the response is successful (status code 200)
      if (result.ok) {
        const data = await result.json();
        console.log(data);
        if (data.ok) {
          console.log('Текстовое сообщение успешно отправлено в Telegram.');
        } else {
          console.error('Произошла ошибка при отправке текстового сообщения.');
        }
      } else {
        console.error('Ошибка при отправке запроса:', result.status);
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  }
  sendMessage(`Поздравляем!🎉🎉🎉 Твой результат: ${window.finallyScore} 👠\n\nИграй каждый день, копи очки и попадай в самый верх рейтинга! ТОП-200 лучших игроков ждут культовые футболки из сериала😏`);
};

HTMLredraw.prototype.gameWin = function () {
  var msg = this.getMessage('You\'ve Won!');

  this.messageWrap.show();
  this.messageWrap.appendChild(msg);
};

HTMLredraw.prototype.getMessage = function (message) {
  var data = { h3: message, p: 'Press <b>restart</b> to restart' };

  var wrap = document.createElement('div');
  for (var tag in data) {
    var elem = document.createElement(tag);
    elem.innerHTML = data[tag];
    wrap.appendChild(elem);
  }

  return wrap;
};

HTMLredraw.prototype.mobileVersion = function () {
  this.bodyWrap.className = 'is-mobile';
};
