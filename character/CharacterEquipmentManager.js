// @ts-check
"use strict";

import { 基底 } from "../Base.js"
import {
  武器,
  防具,
  道具
} from "../item/Item.js"

/**
 * @typedef {import("./Character.js").キャラクター} キャラクター
 */

export class キャラクター装備マネージャー extends 基底 {
  /**
   * @param {import("../Server.js").サーバー} サーバー
   * @param {キャラクター} キャラクター
   */
  constructor(サーバー, キャラクター) {
    super(サーバー);
    this.#キャラクター = キャラクター;
  }

  装備(アイテム, アイテム図鑑に登録する = true) {
    let 交換アイテム名;
    if (アイテム instanceof 武器) {
      交換アイテム名 = this.#武器.名前;
      this.#武器 = アイテム;
    }
    else if (アイテム instanceof 防具) {
      交換アイテム名 = this.#防具.名前;
      this.#防具 = アイテム;
    }
    else if (アイテム instanceof 道具) {
      交換アイテム名 = this.#道具.名前;
      this.#道具 = アイテム;
    }
    else {
      throw new TypeError(`${アイテム.名前}は装備できないアイテムです`);
    }
    if (アイテム図鑑に登録する) {
      // TODO
    }
    if (交換アイテム名 !== undefined) {
      // デフォルトに忠実
      データベース操作.倉庫内のアイテムを入れ替える(this.#武器, 交換アイテム名, this._ID);
      return true;
    }
    return false;
  }

  アイテムに対応するスロットが空いている(アイテム) {
    if (アイテム instanceof 武器) {
      return this.#武器 === undefined;
    }
    else if (アイテム instanceof 防具) {
      return this.#防具 === undefined;
    }
    else if (アイテム instanceof 道具) {
      return this.#道具 === undefined;
    }
    else {
      throw new TypeError(`${アイテム.名前}は装備できないアイテムです`);
    }
  }
  
  売る(アイテム名, 価格) {
    if (this.#武器.名前 === アイテム名) {
      this.#武器 = undefined;
    }
    else if (this.#防具.名前 === アイテム名) {
      this.#防具 = undefined;
    }
    else if (this.#道具.名前 === アイテム名) {
      this.#道具 = undefined;
    }
    else {
      throw new Error("装備中ではないアイテムは売れません");
    }
    this.所持金.収支(価格);
    データベース操作.アイテムを破棄(アイテム名, this._ID);
  }

  ヘッダー用出力() {
    const 断片 = document.createDocumentFragment();
    if (this.#武器) {
      断片.appendChild(document.createTextNode(` E：${this.#武器.名前}`));
    }
    if (this.#防具) {
      断片.appendChild(document.createTextNode(` E：${this.#防具.名前}`));
    }
    if (this.#道具) {
      断片.appendChild(document.createTextNode(` E：${this.#道具.名前}`));
    }
    return 断片;
  }


  こうどう用出力(こうどう名) {
    const 断片 = document.createDocumentFragment();
    if (this.#武器) {
      断片.appendChild(アイテム.一覧(this.#武器.名前).こうどう用出力(こうどう名));
    }
    if (this.#防具) {
      断片.appendChild(アイテム.一覧(this.#防具.名前).こうどう用出力(こうどう名));
    }
    if (this.#道具) {
      断片.appendChild(アイテム.一覧(this.#道具.名前).こうどう用出力(こうどう名));
    }
    return 断片;
  }

  が装備中(アイテム名) {
    return アイテム名 === this.#武器.名前 || アイテム名 === this.#防具.名前 || アイテム名 === this.#道具.名前;
  }

  #キャラクター;
  /**
   * @type {武器}
   */
  #武器;
  /**
   * @type {防具}
   */
  #防具;
  /**
   * @type {道具}
   */
  #道具;
}