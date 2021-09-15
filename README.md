# s_party
 /party(スラッシュパーティー) は、＠パーティーをDiscordのBotとして遊べるようにしようとしている感じのやつです。

# 環境変数(.env)について
`(キー)=(値)`のペアが1行ずつ書かれたオブジェクトです。プログラム中からだと`process.env.(キー)`でアクセスできます。公開すべきではない情報はここに書きましょう。

## Discord関連
`DISCORD_BOT_TOKEN`はDiscord Developer Portal内のApplication別ページのBotタブのTOKENを`[Copy]`すると取得できる値です。

## Google Sheets関連
`GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL`と`GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`は`credentials.json`(でググれば取得方法出てきます)の中の`client_email`と`private_key`の値(value)をコピペしましょう。`private_key`のほうは最初の`------`から最後の`------\n`までが含まれた値です。

`SPREADSHEET_ID`はURLの`https://docs.google.com/spreadsheets/d/(この部分)/`です。なお、対象スプレッドシートの画面右上の`[共有]`ボタンから対象のサービスアカウントを編集者として追加する必要があります。