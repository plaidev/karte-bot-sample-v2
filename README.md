# karte-io-bot-sample-v2
- KARTEのmessageとassignのWebhookやAPIを使ったbotのサンプルです.

## 使い方
- [ ] KARTE管理画面から、botの設定を行います.
- [ ] `config.js`ファイルに必要な設定値を追加します.
    - 以下のような内容で作成してください.

```js
module.exports = {
  KARTE_URL: "https://api.karte.io",
  CLIENT_ID: "bot設定画面のClient Idを設定",
  API_KEY: "KARTE管理画面のAPIキーを設定",
  TOKEN: 'bot設定画面のトークンを設定',
  ALGOLIA_APPLICATION_ID: "AlgoliaのApplicationIdを設定(Algolia検索を使う場合)",
  ALGOLIA_API_KEY: "AlgoliaのApiKeyを設定(Algolia検索を使う場合)",
  ALGOLIA_INDEX_NAME: "AlgoliaのIndexNameを設定(Algolia検索を使う場合)",
  A3RT_API_KEY: "A3RTのApiKeyを設定(A3RT APIを使う場合)"
}
```

- [ ] `npm start`で、port:5000番でサーバーが立ち上がります.

## bot仕様
- `/echo`
    - 来たメッセージをそのまま返します.
- `/a3rt`
    - A3RTのTALK APIを使って、自然な返答を返します.
    - https://a3rt.recruit-tech.co.jp/product/talkAPI/
- `/operator`
    - オペレーター不在時を想定したシナリオで、botが対応します.
    - 通知用メールアドレスの入力を求めたり、ユーザーのメッセージを元にサポートサイトの検索をしたりします.