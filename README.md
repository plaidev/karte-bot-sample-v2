# karte-io-bot-sample-v2
- KARTEのmessageとassignのWebhookやAPIを使ったbotのサンプルです.

## 使い方
- [ ] `npm start`で5000番でサーバーを立ち上げる.
- [ ] `_config.coffee`ファイルを作成し、必要な設定値を追加する.
    - 以下のような内容で作成してください.

```coffee
module.exports = {
  KARTE_URL: "https://t.karte.io"
  KARTE_BOT_APPLICATION_KEY: "bot設定画面のApplicationKeyを設定"
  KARTE_BOT_SECRET_KEY: "bot設定画面のSecretKeyを設定"
  ALGOLIA_APPLICATION_ID: "AlgoliaのApplicationIdを設定(Algolia検索を使う場合)"
  ALGOLIA_API_KEY: "AlgoliaのApiKeyを設定(Algolia検索を使う場合)"
  ALGOLIA_INDEX_NAME: "AlgoliaのIndexNameを設定(Algolia検索を使う場合)"
  A3RT_API_KEY: "A3RTのApiKeyを設定(A3RT APIを使う場合)"
}
```

## bot仕様
- `/echo`
    - 来たメッセージをそのまま返します.
- `/a3rt`
    - A3RTのTALK APIを使って、自然な返答を返します.
    - https://a3rt.recruit-tech.co.jp/product/talkAPI/
- `/operator`
    - オペレーター不在時を想定したシナリオで、botが対応します.
    - 通知用メールアドレスの入力を求めたり、ユーザーのメッセージを元にサポートサイトの検索をしたりします.