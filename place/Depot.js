// @ts-check
"use strict";

import { 一般的な場所 } from "./Place.js"

export class 預かり所 extends 一般的な場所 {
  constructor() {
    super("depot.gif", 場所._訪問方法.いどう, new キャラクター("@ﾆｷｰﾀ", "chr/003.gif"));
    this._こうどうリストリスト.unshift(new こうどうマネージャー(null,
      new こうどう("うる"),
      new こうどう("あずける"),
      new こうどう("ひきだす"),
      new こうどう("おくる")
    ));
  }

  _はなす() {
    super._はなす(
      `ここは${this.名前}だけど、何か用かい？`,
      `${あなた}は、最大$max_depot個まで預けることができるぜ`,
      "転職回数が増えるごとに預けられる個数も増えていくぜ",
      "＠おくる時は、送るアイテムと相手の名前を教えてくれな",
      "＠せいとんすると、武器、防具、道具の順に整頓できるぜ",
      "預かり所がまんぱんだと、相手からのアイテムが受け取れないぜ",
      "預かり所がまんぱんだと、クエストでの宝物を手に入れることができないぜ",
      "ここで売るのも専門店で売るのも売値は変わらないぜ"
    );
  }

  ヘッダー出力() {
    const 断片 = document.createDocumentFragment();
    断片.append(
      this._ヘッダー用出力(),
      強調テキスト(`倉庫：`, 999, "/", 99999, ` / `),
      あなた.メンバー.ヘッダー用出力()
    );
    return 断片;
  }
}
