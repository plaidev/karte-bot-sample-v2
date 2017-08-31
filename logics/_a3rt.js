/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const request = require('request');

module.exports = function(text, cb) {

  if (cb == null) { cb = function(){}; }
  const {A3RT_API_KEY} = require('../config');
  
  return request.post({
    url: "https://api.a3rt.recruit-tech.co.jp/talk/v1/smalltalk",
    formData: {
      apikey: A3RT_API_KEY,
      query: text
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

    console.log(body);

    return cb(null, body.results[0] != null ? body.results[0].reply : undefined);
  });
};
