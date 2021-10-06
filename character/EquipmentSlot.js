// @ts-check
"use strict";

import { メンバー } from "./Member.js"

/**
 * @typedef {import("../item/Item.js").アイテム} 装備
 */

export class 装備スロット {
  /**
   * @param {メンバー} メンバー
   * @param {typeof import("../item/Item.js").アイテム} 装備種別
   * @param {装備} [装備]
   */
  constructor(メンバー, 装備種別, 装備 = null) {
    this.#メンバー = メンバー;
    this.#装備種別 = 装備種別;
    this.#装備 = 装備;
  }

  /**
   * 
   * @param {装備} 装備 
   * @param {boolean} アイテム図鑑に登録する 
   * @returns {?装備} 装備していたアイテム。装備失敗なら`undefined`、装備無しだったなら`null`。
   */
  装着(装備, アイテム図鑑に登録する = true) {
    if (!(装備 instanceof this.#装備種別))
      return undefined;
    const 旧装備 = this.#装備;
    if (アイテム図鑑に登録する) {
      // TODO
    }
    if (旧装備 !== null) {
      // デフォルトに忠実
      データベース操作.倉庫内のアイテムを入れ替える(装備, 旧装備);
    }
    this.#装備 = 装備;
    return 旧装備;
  }

  解除() {
    this.#装備 = null;
  }

  /**
   * @param {string} アイテム名
   * @param {number} 価格
   */
  売る(アイテム名, 価格) {
    if (アイテム名 !== this.#装備.名前) {
      throw new Error("装備中ではないアイテムは売れません");
    }
    this.#メンバー.所持金.収支(価格);
    データベース操作.アイテムを破棄(アイテム名, this._ID);
  }

  /**
   * @returns {boolean}
   */
  get 装備中() { return this.#装備 !== null; }
  get 装備() { return this.#装備; }

  #メンバー;
  #装備種別;
  /**
   * nullなら装備無し
   */
  #装備;
}
