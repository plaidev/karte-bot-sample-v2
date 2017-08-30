express = require('express')
router = express.Router()
algoliasearch = require('algoliasearch');
_send = require('../logics/_send')
_a3rt = require('../logics/_a3rt')
_send_hmac = require('../logics/_send_hmac')
_search = require('../logics/_search')

# webhook
router.post '/echo', (req, res, next) ->

  {KARTE_BOT_APPLICATION_KEY} = require('../config')

  {data, user, event_type} = req.body
  {user_id, assignee} = user

  if event_type == 'message'

    {app_name, message_id, thread_id, content} = data

    # 自分がアサインされていたら、メッセージを送る
    if assignee == 'bot-' + KARTE_BOT_APPLICATION_KEY
      _send 'message', {
        app_name
        user_id
        content:
          text: '僕はエコーサーバーです: ' + content.text
      }, (err) ->
        
        if err
          console.log err
    else
    # 自分がアサインされていなければ、有無を言わさずアサインする
      _send 'assign', {
        user_id
        assignee: 'bot-' + KARTE_BOT_APPLICATION_KEY
      }, (err) ->
        
        if err
          console.log err

  else if event_type == 'assign'

    if assignee == 'bot-' + KARTE_BOT_APPLICATION_KEY
      _send 'message', {
        app_name: 'webchat'
        user_id
        content:
          text: 'こんにちわ。わたしKARTE Botが担当します。 ' 
      }

  return res.json {
    status: 'OK'
  }

# webhook
router.post '/a3rt', (req, res, next) ->

  {KARTE_BOT_APPLICATION_KEY} = require('../config')

  {data, user, event_type} = req.body
  {user_id, assignee} = user

  if event_type == 'message'

    {app_name, message_id, thread_id, content} = data

    if assignee == 'bot-' + KARTE_BOT_APPLICATION_KEY
      _a3rt content.text, (err, text) ->

        if err
          console.log err
          return

        _send 'message', {
          app_name
          user_id
          content:
            text: text
        }, (err) ->
          
          if err
            console.log err
          
  return res.json {
    status: 'OK'
  }

# webhook
router.post '/operator', (req, res, next) ->
  {KARTE_BOT_APPLICATION_KEY} = require('../config')
  {data, user, event_type} = req.body
  {user_id, assignee} = user
  {app_name, message_id, thread_id, content} = data
  if event_type == 'assign'
    if assignee is 'bot-' + KARTE_BOT_APPLICATION_KEY
      _send_delayed_msgs user_id, [
        'こんにちは。私たちのチームは、来週の月曜日に戻ってきます。'
        '私に手伝えることがあれば、教えてください。'
        '`{"type":"buttons","buttons":[{"title":"メールで通知を受け取る"},{"title":"わからない用語を質問する"}]}`'
      ]

  else if event_type == 'message'
    if assignee is 'bot-' + KARTE_BOT_APPLICATION_KEY
      if content?.text == "[#メールで通知を受け取る]"
        _send_delayed_msgs user_id, [
          '通知を受け取るメールアドレスを入力してください。'
          '`{"type": "input", "input": {"title":"通知を受け取る","placeholder":"example.com","button":"確定","name":"email","event_name":"identify"}}`'
        ]
      else if (/^\[#(.*)質問する\]$/).test(content?.text)
        _send_delayed_msgs user_id, [
          'ありがとうございます。'
          '知りたい用語を入力してください。'
        ]
      else if (/^\[#email/).test(content?.text)
        _send_delayed_msgs user_id, [
          '入力ありがとうございました。'
          'チームメンバーが戻り次第、ご連絡差し上げます。'
          '👋'
        ]
        _unassign user_id
      else if (/^\[#質問を終える\]$/).test(content?.text)
        _send_delayed_msgs user_id, [
          'ご質問ありがとうございました。'
          '👋'
        ]
        _unassign user_id
      else
        _search {
          text: content.text
          count: 5
        }, (err, result) ->
          console.log err if err
          if result.count == 0 or err
            texts = [
              '申し訳ありません、記事が見つかりませんでした。'
              '`{"type":"buttons","buttons":[{"title":"質問を終える"},{"title":"まだ質問する"}]}`'
            ]
            _send_delayed_msgs user_id, texts
          else
            texts = [
              'ご質問ありがとうございます。'
              'もしかしたら、これらの記事が役に立つかもしれません。'
              _makeLinkMessageStr(result.hits)
              '`{"type":"buttons","buttons":[{"title":"質問を終える"},{"title":"まだ質問する"}]}`'
            ]
            _send_delayed_msgs user_id, texts
  return res.json {
    status: 'OK'
  }

_unassign = (user_id) ->
  # アサインを外す
  _send 'assign', {
    user_id
    assignee: null
    options: {
      # 同時に「対応済み」にする
      finish_responding: true
    }
  }, (err) ->
    if err
      console.log err

_send_delayed_msgs = (user_id, texts) ->
  return if not texts
  promises = texts.map (txt, i) ->
    return new Promise (resolve, reject) ->
      setTimeout () ->
        _send 'message', {
          app_name: 'webchat'
          user_id
          content:
            text: txt
        }, resolve
      , i * 1000
  Promise.all(promises)

_makeLinkMessageStr = (links) ->
  # link UI example:
  # '`{"type":"links","links":[{"title":"PLAID公式サイト","url":"https://plaid.co.jp/"},{"title":"KARTE公式サイト","url":"https://karte.io/"}]}`'
  str = '`{"type":"links","links":['
  for link in links
    str += JSON.stringify(link)+','
  str = str.slice(0, -1)
  str += ']}`'
  return str

module.exports = router
