
request = require 'request'

module.exports = (path, body, cb=()->) ->

  {KARTE_URL, KARTE_BOT_APPLICATION_KEY} = require('../config')
  
  public_key = KARTE_BOT_APPLICATION_KEY

  request.post {
    url: KARTE_URL + "/v0/#{path}"
    body: JSON.stringify body
    headers:
      'Content-Type': 'application/json'
      'X-KARTE-App-Key': "#{public_key}"
  }, (err, res, body) ->

    if err
      console.log err
      return cb err

    try
      body = JSON.parse(body)
    catch err
      return cb err

    if body.error
      return cb new Error(body.error)

    return cb null
