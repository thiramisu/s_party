// @ts-check
"use strict";

import { 基底 } from "./Base.js"
import { 色名 } from "./config.js"

/**
 * @typedef {import("./character/Character.js").メンバー} メンバー
 */

export class ギルド extends 基底 {
  /**
   * @param {import("./Server.js").サーバー} サーバー
   * @param {string} 名前
   */
  constructor(サーバー, 名前) {
    super(サーバー);
    this.#名前 = 名前;
  }

  解散() {
    this.サーバー.ニュース.書き込む(`${this.#名前} ギルドが解散しました`, 色名.死亡);
    this.サーバー.ギルド.削除(this.#名前);
  }

  加入申請() {

  }
  
  メンバー追加(メンバー) {
    this.#メンバー.set(メンバー.ID, メンバー);
  }

  /**
   * 
   * @param {メンバー} メンバー 
   * @returns 
   */
  メンバー削除(メンバー) {
    if (this.#メンバー.Count() === 1) {
      this.解散();
      return;
    }
    this.#メンバー.delete(メンバー.ID);
    if (メンバー.ID === this.#ギルマスID) {
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

  get 名前() { return this.#名前; }
  get ギルマスID() { return this.#ギルマスID; }

  /**
   * @type {string}
   */
  #名前;
  /**
   * @type {import("discord.js").Snowflake}
   */
  #ギルマスID;
  #メンバー;
  #色;
  #背景;
  #めっせーじ;
  #ポイント;
  static #次期ギルマスか = new RegExp(/ギルマス/);

  static 必要なら一覧更新() {

  }
}
