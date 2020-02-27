const express = require('express');
const router = express.Router();
const algoliasearch = require('algoliasearch');
const _send = require('../logics/_send');
const _a3rt = require('../logics/_a3rt');
const _search = require('../logics/_search');


// webhook
router.post('/echo', (req, res, next) => {

  const {CLIENT_ID, API_KEY} = require('../config');
  const {event_type, user_id, assignee, app_name, content} = req.body;
  
  if (event_type === 'message') {

    // 自分がアサインされていたら、メッセージを送る
    if (assignee.id === CLIENT_ID) {
      _send('message', {
        client_id: CLIENT_ID,
        api_key: API_KEY,
        app_name,
        user_id,
        content: {
          text: `僕はエコーサーバーです: ${content.text}`
        },
        from_user: false
      }, (err) => {
        
        if (err) {
          return console.log(err);
        }
      });
    } else {
    // 自分がアサインされていなければ、有無を言わさずアサインする
      _send('assign', {
        client_id: CLIENT_ID,
        api_key: API_KEY,
        user_id,
        assignee:{
          id:CLIENT_ID,
          is_bot:true
        }
      }, (err) => {
        
        if (err) {
          return console.log(err);
        }
      });
    }

  } else if (event_type === 'assign') {

    if (assignee.id === CLIENT_ID) {
      _send('message', {
        client_id: CLIENT_ID,
        api_key: API_KEY,
        app_name: 'webchat',
        user_id,
        content: {
          text: 'こんにちわ。わたしKARTE Botが担当します。 '
        },
        from_user: false
      });
    }
  }

  return res.json({
    status: 'OK'
  });
});

// webhook
router.post('/a3rt', (req, res, next) => {

  const {CLIENT_ID, API_KEY} = require('../config');
  const {event_type, user_id, assignee, app_name, content} = req.body;

  if (event_type === 'message') {


    if (assignee.id === CLIENT_ID) {
      _a3rt(content.text, (err, text) => {

        if (err) {
          console.log(err);
          return;
        }

        return _send('message', {
          client_id: CLIENT_ID,
          api_key: API_KEY,
          app_name,
          user_id,
          content: {
            text
          },
          from_user: false
        }, (err) => {
          
          if (err) {
            return console.log(err);
          }
        });
      });
    }
  }
          
  return res.json({
    status: 'OK'
  });
});

// webhook
router.post('/operator', (req, res, next) => {
  const {CLIENT_ID, API_KEY} = require('../config');
  const {event_type, user_id, assignee, content} = req.body;
  if (event_type === 'assign') {
    if (assignee.id === CLIENT_ID) {
      _send_delayed_msgs(user_id, [
        'こんにちは。私たちのチームは、来週の月曜日に戻ってきます。',
        '私に手伝えることがあれば、教えてください。',
        '`{"type":"buttons","buttons":[{"title":"メールで通知を受け取る"},{"title":"わからない用語を質問する"}]}`'
      ], CLIENT_ID, API_KEY);
    }

  } else if (event_type === 'message') {
    if (assignee.id === CLIENT_ID) {
      if ((content != null ? content.text : undefined) === "[#メールで通知を受け取る]") {
        _send_delayed_msgs(user_id, [
          '通知を受け取るメールアドレスを入力してください。',
          '`{"type": "input", "input": {"title":"通知を受け取る","placeholder":"example.com","button":"確定","name":"email","event_name":"identify"}}`'
        ], CLIENT_ID, API_KEY);
      } else if ((/^\[#(.*)質問する\]$/).test(content != null ? content.text : undefined)) {
        _send_delayed_msgs(user_id, [
          'ありがとうございます。',
          '知りたい用語を入力してください。'
        ], CLIENT_ID, API_KEY);
      } else if ((/^\[#email/).test(content != null ? content.text : undefined)) {
        _send_delayed_msgs(user_id, [
          '入力ありがとうございました。',
          'チームメンバーが戻り次第、ご連絡差し上げます。',
          '👋'
        ], CLIENT_ID, API_KEY);
        _unassign(user_id, CLIENT_ID, API_KEY);
      } else if ((/^\[#質問を終える\]$/).test(content != null ? content.text : undefined)) {
        _send_delayed_msgs(user_id, [
          'ご質問ありがとうございました。',
          '👋'
        ], CLIENT_ID, API_KEY);
        _unassign(user_id, CLIENT_ID, API_KEY);
      } else {
        _search({
          text: content.text,
          count: 5
        }, (err, result) => {
          let texts;
          if (err) { console.log(err); }
          if ((result.count === 0) || err) {
            texts = [
              '申し訳ありません、記事が見つかりませんでした。',
              '`{"type":"buttons","buttons":[{"title":"質問を終える"},{"title":"まだ質問する"}]}`'
            ];
            return _send_delayed_msgs(user_id, texts, CLIENT_ID, API_KEY);
          } else {
            texts = [
              'ご質問ありがとうございます。',
              'もしかしたら、これらの記事が役に立つかもしれません。',
              _make_link_message_str(result.hits),
              '`{"type":"buttons","buttons":[{"title":"質問を終える"},{"title":"まだ質問する"}]}`'
            ];
            return _send_delayed_msgs(user_id, texts, CLIENT_ID, API_KEY);
          }
        });
      }
    }
  }
  return res.json({
    status: 'OK'
  });
});


const _unassign = (user_id, client_id, api_key) =>
  // アサインを外す
  _send('assign', {
    client_id,
    api_key,
    user_id,
    assignee: null,
    options: {
      // 同時に「対応済み」にする
      finish_responding: true
    }
  }, (err) => {
    if (err) {
      return console.log(err);
    }
  })
;

const _send_delayed_msgs = (user_id, texts, client_id, api_key) => {
  if (!texts) { return; }
  const promises = texts.map((txt, i) =>
    new Promise((resolve, reject) => {
      return setTimeout(() =>
        _send('message', {
          client_id,
          api_key,
          app_name: 'webchat',
          user_id,
          content: {
            text: txt
          },
          from_user: false
        }, resolve)
      
      , i * 1000);
    })
  );
  return Promise.all(promises);
};

const _make_link_message_str = (links) => {
  // link UI example:
  // '`{"type":"links","links":[{"title":"PLAID公式サイト","url":"https://plaid.co.jp/"},{"title":"KARTE公式サイト","url":"https://karte.io/"}]}`'
  let str = '`{"type":"links","links":[';
  for (let link of Array.from(links)) {
    str += JSON.stringify(link)+',';
  }
  str = str.slice(0, -1);
  str += ']}`';
  return str;
};

module.exports = router;
