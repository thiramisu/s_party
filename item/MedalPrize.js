// @ts-check
"use strict";

import { 取引アイテムインターフェース } from "./ItemInterface.js";

class メダル王の賞品 extends 取引アイテムインターフェース {
  constructor(アイテム名, 価値) {
    super(アイテム名, 価値);
    this.#アイテム名 = アイテム名;
  }

  // デフォルトに忠実
  get 名前() { return `${this.価値}枚`; }
  get アイテム名() { return this.#アイテム名; }

  _陳列用出力(クリック時のこうどう名) {
    return super._陳列用出力(クリック時のこうどう名, this.アイテム名, this.名前);
  }

  static _陳列用ヘッダー項目名リスト = ["賞品", "ﾒﾀﾞﾙ"];

  #アイテム名;
}