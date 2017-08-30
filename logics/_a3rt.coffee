
request = require 'request'

module.exports = (text, cb=()->) ->

  {A3RT_API_KEY} = require('../config')
  
  request.post {
    url: "https://api.a3rt.recruit-tech.co.jp/talk/v1/smalltalk"
    formData: {
      apikey: A3RT_API_KEY
      query: text
    }
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

    console.log body

    return cb null, body.results[0]?.reply
