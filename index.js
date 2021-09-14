// @ts-check
"use strict";

import http from "http"

http.createServer(function (request, response) {
  response.writeHead(200, { "Content-Type": "text/plain" })
  response.end("Discord bot is active now \n")
})
  .listen(3000);

if (process.env.DISCORD_BOT_TOKEN === undefined) {
  console.error("tokenが設定されていません！");
  process.exit(0);
}
process.env.HOGE = "humu";

//*/
import('./party.js')
/*/
require('./test/calc.js')
//*/
