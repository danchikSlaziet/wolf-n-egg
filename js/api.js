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

  sendStatistics(name, data) {
    let url;
    if (data["last_name"] === '' && data["username"] === '') {
      url = this._baseUrl + `?name=${name}&user_id=${data["id"]}&first_name=${data["first_name"]}`;
    }
    else if (data["last_name"] !== '' && data["username"] === '') {
      url = this._baseUrl + `?name=${name}&user_id=${data["id"]}&first_name=${data["first_name"]}&last_name=${data["last_name"]}`;
    }
    else if (data["last_name"] === '' && data["username"] !== '') {
      url = this._baseUrl + `?name=${name}&user_id=${data["id"]}&first_name=${data["first_name"]}&username=${data["username"]}`;
    }
    else if (data["last_name"] !== '' && data["username"] !== '') {
      url = this._baseUrl + `?name=${name}&user_id=${data["id"]}&first_name=${data["first_name"]}&username=${data["username"]}&last_name=${data["last_name"]}`;
    }
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

  getRating() {
    const url = this._fourthUrl;
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
  appendScore(id, score) {
    const url = this._thirdUrl + `?user_id=${id}&score=${score}`;
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
}

const api = new Api({
  baseUrl: 'https://bukin.ilovebot.ru/api/statistics/',
  secondUrl: 'https://bukin.ilovebot.ru/api/user_tokens/',
  thirdUrl: 'https://bukin.ilovebot.ru/api/append_score/',
  fourthUrl: 'https://bukin.ilovebot.ru/api/rating/'
});

window.api = api;