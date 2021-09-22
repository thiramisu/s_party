// @ts-check
"use strict";

import { 取引アイテムインターフェース } from "./ItemInterface.js";


class 裏取引アイテム extends 取引アイテムインターフェース {
  _陳列用出力(クリック時のこうどう名) {
    return super._陳列用出力(クリック時のこうどう名, this.名前, `${this.価値} Pt`);
  }

  static _陳列用ヘッダー項目名リスト = ["名前", "ﾚｱﾎﾟｲﾝﾄ"];
}