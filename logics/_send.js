const request = require('request');

module.exports = (path, body, cb) => {

  if (!cb) { cb = () => {}; }
  const {KARTE_URL, TOKEN} = require('../config');
  
  return request.post({
    url: KARTE_URL + `/v1/talk/${path}`,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${TOKEN}`
    }
  }, (err, res, body) => {

    if (err) {
      console.log(err);
      return cb(err);
    }

    try {
      body = JSON.parse(body);
    } catch (error) {
      err = error;
      return cb(err);
    }

    if (body.error) {
      console.log(body)
      return cb(new Error(body.error));
    }

    return cb(null);
  });
};
