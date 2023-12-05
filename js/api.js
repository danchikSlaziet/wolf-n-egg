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
    const url = this._baseUrl + `?name=${name}&user_id=${id}`;
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

  getTries(id) {
    const url = this._secondUrl + `?user_id=${id}`;
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

  postTries(id) {
    const url = this._secondUrl + `?user_id=${id}`;
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
      body: ''
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

window.api = api;