const request = require('request');
const crypto = require('crypto');

const _signature = (secret_key, body) => {
  const signature = crypto.createHmac('sha256', secret_key).update(new Buffer(body, 'utf8')).digest('base64');
  return signature;
};

module.exports = (path, body, cb) => {

  if (!cb) { cb = () => {}; }
  const {KARTE_URL, KARTE_BOT_APPLICATION_KEY, KARTE_BOT_SECRET_KEY} = require('../config');

  const public_key = KARTE_BOT_APPLICATION_KEY;
  const timestamp = (new Date()).toISOString();
  
  body = JSON.stringify(body);
  const signature = _signature(KARTE_BOT_SECRET_KEY, body);

  return request.post({
    url: KARTE_URL + `/v0/${path}`,
    body,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-KARTE-App-Key': `${public_key}`,
      'Authorization': `KARTE0-HMAC-SHA256 TimeStamp=\"${timestamp}\",Signature=\"${signature}\"`
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
      return cb(new Error(body.error));
    }

    return cb(null);
  });
};