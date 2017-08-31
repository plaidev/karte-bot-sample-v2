/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const request = require('request');

module.exports = function(path, body, cb) {

  if (cb == null) { cb = function(){}; }
  const {KARTE_URL, KARTE_BOT_APPLICATION_KEY} = require('../config');
  
  const public_key = KARTE_BOT_APPLICATION_KEY;

  return request.post({
    url: KARTE_URL + `/v0/${path}`,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'X-KARTE-App-Key': `${public_key}`
    }
  }, function(err, res, body) {

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
