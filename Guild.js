// @ts-check
"use strict";

import { 基底 } from "./Base.js"

export class ギルド extends 基底 {
  削除() {
    this.サーバー.ニュース.書き込み(`< span class="die" > ${this.#名前} ギルドが解散しました</ > `);
  }

  メンバー削除(メンバー) {
    if (this.#メンバー.Count() === 1) {
      this.削除();
      return;
    }
    this.#メンバー.delete(メンバー);
    if (メンバー === this.#ギルマス) {
      this.ギルマス交代();
    }
  }

  ギルマス交代(次期ギルマス = this.#次期ギルマス取得()) {
  }

  static 必要なら一覧出力() {
    // TODO  
  }

  #次期ギルマス取得() {
    const 配列メンバー = Array.from(this.#メンバー);
    return 配列メンバー.find(this.#名前にギルマスを含む, this)
      ?? 配列メンバー[0];
  }

  #名前にギルマスを含む(メンバー) {
    return ギルド.#次期ギルマスか.test(メンバー.#名前);
  }

  toString() {
    return this.#名前;
  }

  #名前;
  #ギルマス;
  #メンバー;
  #色;
  #背景;
  #めっせーじ;
  #ポイント;
  static #次期ギルマスか = new RegExp(/ギルマス/);

  static 必要なら一覧更新() {

  }
}
