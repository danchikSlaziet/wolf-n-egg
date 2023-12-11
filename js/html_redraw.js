function HTMLredraw() {
  this.bodyWrap = document.querySelector('body');
  this.gameWrap = document.querySelector('#game-wrap');
  this.scoreWrap = document.querySelector('#score');
  this.messageWrap = document.querySelector('#message');
  this.startButton = document.querySelector('.first-page__button');
  this.scoreNums = 4;

  window.isFirst;

  window.botToken = '6957221719:AAE7LqjBy8_vRw6Z-pLmg8e6-fJii2XSybQ';
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
    let user_data = JSON.parse(user_data_str);
    window.userData = user_data;
    app.expand();
    app.ready();
    window.userChatId = user_data["id"];
    console.log(window.userChatId);
    window.api.sendStatistics('открытие приложения/переход на начальный экран', window.userData)
      .then((data) => {
        if (data === 'Новый') {
          window.isFirst = true;
        }
        else if (data === 'Старый') {
          window.isFirst = false;
        }
        console.log(data);
      })
      .catch(err => console.log(err));
    window.api.getTries(window.userChatId)
      .then((data) => {
        console.log(data);
        if (data.trim() <= 0) {
          document.querySelector('.refer-page').classList.remove('refer-page_disabled');
        }
        document.querySelector('.first-page__button-count').textContent = data;
      })
      .catch(err => console.log(err))
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
  if (score === "2") {
    activeBell();
  }
  if (score === "5") {
    activeBell();
  }
  if (score === "12") {
    activeBell();
  }
  if (score === "20") {
    activeBell();
  }
  if (score === "25") {
    activeBell();
  }
  if (score === "30") {
    activeBell();
  }
  if (score === "50") {
    activeBell();
  }
  if (score === "100") {
    activeBell();
  }
};

HTMLredraw.prototype.updateLossCount = function (data) {
  this.changeAttributesValue(['data-loss'], [data.loss]);
};

HTMLredraw.prototype.gameOver = function () {
  document.querySelector('.final-page').classList.remove('final-page_disabled');
  window.api.appendScore(window.userChatId, window.finallyScore)
    .then(data => console.log(data))
    .catch(err => console.log(err))
    .finally(() => {
      document.querySelector('.rating-page__rating').innerHTML = '';
      window.api.getRating()
      .then((data) => {
        console.log(data);
        let yourselfPosition = data["rating"].findIndex(elem => elem["id"] == window.userChatId) + 1;
        console.log(`yourselfPosition: ${yourselfPosition}`);
        for (let i = 0; i <= 9; i++) {
          let className = i + 1 == yourselfPosition ? 'rating-page__user rating-page__user_yourself' : 'rating-page__user';
          let name;
          if (data["rating"][i]["username"] === null) {
            name = data["rating"][i]["first_name"];
          }
          else {
            name = data["rating"][i]["username"];
          }
          let yourselName;
          if (data["rating"][yourselfPosition - 1]["username"] === null) {
            yourselName = data["rating"][yourselfPosition - 1]["first_name"];
          }
          else {
            yourselName = data["rating"][yourselfPosition - 1]["username"];
          }
          if (data["rating"].length <= 10 && ((i + 1) <= data["rating"].length)) {
            document.querySelector('.rating-page__rating').innerHTML += `
              <li class="${className}">
                <span class="rating-page__number">${i + 1}</span>
                <span class="rating-page__name">${name.slice(name.length/2).padStart(name.length, '*')}</span>
                <span class="rating-page__count">${data["rating"][i]["score"]}</span>
              </li>
              `;
          }
          else {
            if (yourselfPosition <= 10) {
              document.querySelector('.rating-page__rating').innerHTML += `
                <li class="${className}">
                  <span class="rating-page__number">${i + 1}</span>
                  <span class="rating-page__name">${name.slice(name.length/2).padStart(name.length, '*')}</span>
                  <span class="rating-page__count">${data["rating"][i]["score"]}</span>
                </li>
                `;
            }
            else {
              if (i < 9) {
                document.querySelector('.rating-page__rating').innerHTML += `
                <li class="rating-page__user">
                  <span class="rating-page__number">${i + 1}</span>
                  <span class="rating-page__name">${name.slice(name.length/2).padStart(name.length, '*')}</span>
                  <span class="rating-page__count">${data["rating"][i]["score"]}</span>
                </li>
                `;
              }
              else if (i == 9) {
                document.querySelector('.rating-page__rating').innerHTML += `
                <li class="rating-page__user">
                  <span class="rating-page__number">${i + 1}</span>
                  <span class="rating-page__name">${name.slice(name.length/2).padStart(name.length, '*')}</span>
                  <span class="rating-page__count">${data["rating"][i]["score"]}</span>
                </li>
                `;
                document.querySelector('.rating-page__rating').innerHTML += `
                <li class="rating-page__user rating-page__user_yourself">
                  <span class="rating-page__number">${yourselfPosition}</span>
                  <span class="rating-page__name">${yourselName.slice(yourselName.length/2).padStart(yourselName.length, '*')}</span>
                  <span class="rating-page__count">${data["rating"][yourselfPosition - 1]["score"]}</span>
                </li>
                `;
              }
            }
          }

        }
      })
      .catch(err => console.log(err));
    })

  async function sendMessage(text) {
    // Формируем объект FormData для отправки текстового сообщения
    const formData = new FormData();
    formData.append('chat_id', window.userChatId);
    formData.append('text', text);
    formData.append('reply_markup', JSON.stringify(
      {
        'inline_keyboard': 
        [
            [
                {'text': 'Играть',
                'web_app': {'url': 'https://bukin.ilovebot.ru/game/'}},
                {'text': 'Пригласить друзей',
                'callback_data': 'ref'},
            ],
        ],
      }
    ));

    // Отправка текстового сообщения на сервер Telegram
    try {
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
  if (window.isFirst) {
    sendMessage(`Отличная работа! 👠👠👠\n\nИграй каждый день, копи очки и попадай в самый верх рейтинга! ТОП-200 лучших игроков ждут культовые футболки из сериала😏`)
  }
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
