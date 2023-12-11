/*
 *  "Catch the Egg" JavaScript Game
 *  source code  : https://github.com/shtange/catch-the-egg
 *  play it here : https://shtange.github.io/catch-the-egg/
 *
 *  Copyright 2015, Yurii Shtanhei
 *  GitHub : https://github.com/shtange/
 *  Habr   : https://habrahabr.ru/users/shtange/
 *  email  : y.shtanhei@gmail.com
 *
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/MIT
 */

var GameManager = function() {
  this.init();
  this.setup();
  this.audio = document.querySelector('.page__audiotrack');
  this.bellAudio = document.querySelector('.page__bell-track');
  document.querySelector('.first-page__button').addEventListener('click', () => {
    document.querySelector('.first-page').classList.add('first-page_disabled');
    this.start();
    window.api.sendStatistics('нажатие на кнопку ИГРАТЬ', window.userData)
      .then(data => console.log(data))
      .catch(err => console.log(err));
    window.api.postTries(window.userChatId)
      .then((data) => {
        console.log(data);
        document.querySelector('.final-page__button-count').textContent = data;
        document.querySelector('.first-page__button-count').textContent = data;
      })
      .catch(err => console.log(err));
  });
  window.isGameOver = false;
  document.querySelector('.final-page__restart').addEventListener('click', () => {
    this.reStart();
    window.api.sendStatistics('нажатие на кнопку ЕЩЁ РАЗ', window.userData)
      .then(data => console.log(data))
      .catch(err => console.log(err));
  });
  document.querySelector('.final-page__rating').addEventListener('click', () => {
    // document.querySelector('.final-page').classList.add('final-page_disabled');
    document.querySelector('.rating-page').classList.remove('rating-page_disabled');
    window.api.sendStatistics('нажатие на кнопку РЕЙТИНГ', window.userData)
      .then(data => console.log(data))
      .catch(err => console.log(err));
  });
  document.querySelector('.rating-page__back').addEventListener('click', () => {
    document.querySelector('.rating-page').classList.add('rating-page_disabled');
    // document.querySelector('.final-page').classList.remove('final-page_disabled');
    window.api.sendStatistics('нажатие на кнопку НАЗАД на странице рейтинга', window.userData)
      .then(data => console.log(data))
      .catch(err => console.log(err));
  });
  document.querySelector('.console-buttons__img_rating').addEventListener('click', () => {
    document.querySelector('.rating-page__rating').innerHTML = '';
    document.querySelector('.rating-page').classList.remove('rating-page_disabled');
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
    window.api.sendStatistics('нажатие на кнопку РЕЙТИНГ на консоли (верхний правый угол)', window.userData)
      .then(data => console.log(data))
      .catch(err => console.log(err));
  });
  document.querySelectorAll('.console-buttons__img').forEach((button) => {
    button.addEventListener('touchstart', () => {
      button.style = 'background-image: url(./img/button-ellipse-active.png';
    });
    button.addEventListener('touchend', () => {
      button.style = 'background-image: url(./img/button-ellipse.png';
    });
  });
  document.querySelectorAll('.controls-btn').forEach((button) => {
    button.addEventListener('touchstart', (evt) => {
      button.style = 'background-image: url(./img/control-btn-active.png)';
    });
    button.addEventListener('touchend', (evt) => {
      button.style = 'background-image: url(./img/control-btn.png)';
    })
  });
  document.querySelector('.console-buttons__img_game').addEventListener('click', () => {
    this.reStart();
    window.api.sendStatistics('нажатие на кнопку ЗАНОВО', window.userData)
      .then(data => console.log(data))
      .catch(err => console.log(err));
  });
  document.querySelector('.console-buttons__img_sound').addEventListener('click', () => {
    if (this.audio.paused) {
      this.audio.play();
      this.bellAudio.muted = false;
    }
    else {
      this.audio.pause();
      this.bellAudio.muted = true;
    }
    window.api.sendStatistics('нажатие на кнопку ЗВУК', window.userData)
      .then(data => console.log(data))
      .catch(err => console.log(err));
  });
  document.querySelector('.refer-page__button').addEventListener('click', () => {
    navigator.clipboard.writeText(`https://t.me/TNT_GameBot?start=${window.userChatId}`)
    .then(() => {
      console.log("Invite link copied!");
      document.querySelector('.refer-page__notif').classList.add('refer-page__notif_active');
      setTimeout(() => {
        document.querySelector('.refer-page__notif').classList.remove('refer-page__notif_active')
      }, 3500)
    })
    .catch(err => console.error(err));
    window.api.sendStatistics('нажатие на кнопку ПРИГЛАСИТЬ ДРУЗЕЙ', window.userData)
      .then(data => console.log(data))
      .catch(err => console.log(err));
  });
}

// Initial game settings
GameManager.prototype.init = function () {
  this.score = 0;
  this.loss = 0;
  this.over = false;
  this.won = false;

  this.count = 4;
  this.level = 1;
  this.speed = 800;
  // this.maxSpeed = 200;
  this.interval = this.speed*2.5;
  this.point = 1;

  this.chickens = {};
  this.eggs = {};

  this.gameTimer;

  this.basketStartPosition = { x: 0, y: 1 };
};

// Set up the game
GameManager.prototype.setup = function () {
  this.keyboard = new KeyboardInputManager();
  this.keyboard.on("move", this.move.bind(this));

  this.grid = new Grid(this.count);
  this.basket = new Basket(this.basketStartPosition);

  for (var i = 0; i < this.count; i++) {
    this.chickens[i] = new Chicken(i, this.grid.list[i], this.point);
  }

  this.HTMLredraw = new HTMLredraw();

  if (this.isMobile()) {
    this.touchscreenModification();
  }
};

GameManager.prototype.isMobile = function() {
  try {
    document.createEvent("TouchEvent");
    return true;
  }
  catch(e) {
    return false;
  }
};

GameManager.prototype.move = function (data) {
  var position = { x: this.basket.x, y: this.basket.y };

  switch (data.type) {
    case 'arrow':
      // 0: up, 1: right, 2: down, 3: left, 4: R - restart
      if(data.key%2 == 0) {
        position.y = (data.key > 0) ? 0 : 1;
      } else {
        position.x = (data.key > 2) ? 0 : 1;
      }
      break;
    case 'button':
      position.x = data.x;
      position.y = data.y;
      break;
    case 'common':
      if (data.key == 'restart') {
        this.reStart();
        return false;
      }
      break;
  }

  this.basket.updatePosition(position, this.api.bind(this));
}

GameManager.prototype.start = function () {
  this.runGear();
};

GameManager.prototype.reStart = function () {
  window.location.reload();
};

GameManager.prototype.runGear = function () {
  var self = this;
  this.gameTimer = setInterval(function() {
    var chicken = self.findAvailableChicken();
    if (chicken >= 0 && !this.over) {
      self.runEgg(chicken);
    }
  }, this.interval);
};

GameManager.prototype.suspendGear = function () {
  clearInterval(this.gameTimer);
  this.runGear();
};

GameManager.prototype.haltGear = function () {
  clearInterval(this.gameTimer);
  this.over = true;
};

GameManager.prototype.upLevel = function () {
  this.level++;

  switch (true) {
    case (this.level === 2):
      this.speed = 700;
      break;
    case (this.level === 3):
      this.speed = 600;
      break;
    case (this.level === 4):
      this.speed = 500;
      break;
    case (this.level === 5):
      this.speed = 450;
      break;
    case (this.level === 6):
      this.speed = 400;
      break;
    case (this.level === 7):
      this.speed = 300;
      break;
    case (this.level === 8):
      this.speed = 250;
      break;
    case (this.level === 9):
      this.speed = 200;
      break;
    default:
      this.speed += -25;
      break;
  }
  this.interval = this.speed*2.5;

  this.suspendGear();
};

GameManager.prototype.updateScore = function (data) {
  if (this.grid.list[data.egg].x == this.basket.x && this.grid.list[data.egg].y == this.basket.y) {
    this.score += this.point;
    console.log(this, this.score)
    this.HTMLredraw.updateScore({ value: this.score });

    if (this.score >= 1000) {
      this.gameWin();
      return false;
    }

    if (this.score === 2) {
      this.upLevel();
    }
    if (this.score === 5) {
      this.upLevel();
    }
    if (this.score === 12) {
      this.upLevel();
    }
    if (this.score === 20) {
      this.upLevel();
    }
    if (this.score === 25) {
      this.upLevel();
    }
    if (this.score === 30) {
      this.upLevel();
    }
    if (this.score === 50) {
      this.upLevel();
    }
    if (this.score === 100) {
      this.upLevel();
    }
  } else {
    this.loss++;
    this.HTMLredraw.updateLossCount({ loss: this.loss });
    if (this.loss > 2 && !this.over) {
      window.finallyScore = this.score;
      this.gameOver();
    }
  }
};

GameManager.prototype.findAvailableChicken = function() {
  var avail = this.grid.avail.diff(this.grid.hold);

  if (!avail) {
    return null;
  }

  var chicken = avail.randomElement();
  this.api('onHoldChicken', { egg: chicken });

  return chicken;
};

GameManager.prototype.runEgg = function(chicken) {
  this.chickens[chicken].egg.run(this.speed, this.api.bind(this));
};

GameManager.prototype.gameOver = function() {
  this.haltGear();
  this.HTMLredraw.gameOver();
  window.isGameOver = true;
};

GameManager.prototype.gameWin = function() {
  this.haltGear();
  this.HTMLredraw.gameWin();
};

GameManager.prototype.api = function(method, data) {
  switch (method) {
    case 'updateScore':
      this.updateScore(data);
      break;
    case 'onHoldChicken':
      this.grid.onHold(data.egg);
      break;
    case 'unHoldChicken':
      this.grid.unHold(data.egg);
      break;
    case 'updateEggPosition':
      this.HTMLredraw.updateEggPosition(data);
      break;
    case 'updateBasketPosition':
      this.HTMLredraw.updateBasketPosition(data);
      break;
  }
};

GameManager.prototype.touchscreenModification = function() {
  var buttons = document.querySelector('#controls').getElementsByTagName('a');

  var self = this;
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].onclick = function() {
      var data = { x: this.getAttribute('data-x'), y: this.getAttribute('data-y'), type: 'button' };
      self.move(data);
      return false;
    };
  }

  this.HTMLredraw.mobileVersion();
};