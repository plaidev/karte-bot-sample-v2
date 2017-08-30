express = require('express')
router = express.Router()
config = require('../config')
_send = require('../logics/_send')

### GET home page. ###

router.get '/', (req, res, next) ->

  {KARTE_BOT_APPLICATION_KEY} = require('../config')

  _send 'track', {
    keys:
      user_id: 'bot'
    event_name: 'bot_sample_server_view_post'
    values:
      method: 'post'
  }

  return res.render 'index', {title: 'karte io bot sample server', KARTE_BOT_APPLICATION_KEY}

module.exports = router
