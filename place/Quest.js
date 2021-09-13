"use strict";

import { 一般的な場所 } from "./Place.js"

export class 冒険に出る extends 一般的な場所 {
  constructor() {
    super("quest.gif", 場所._訪問方法.いどう);
    this._こうどうリストリスト.unshift(new こうどうマネージャー(null,
      new クエストをつくる(),
      new こうどう()
    ));
  }

  ヘッダー出力() {
    const 出力 = super.ヘッダー出力("冒険中のパーティー");
    return 出力;
  }
}
