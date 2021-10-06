// @ts-check
"use strict";

import { 基底 } from "../Base.js"
import {
  武器,
  防具,
  道具
} from "../item/Item.js"
import { 装備スロット } from "./EquipmentSlot.js";

/**
 * @typedef {import("./Member.js").メンバー} キャラクター
 * @typedef {import("../item/Item.js").アイテム} アイテム 
 */

export class 装備スロットマネージャー extends 基底 {
  /**
   * @param {import("../Server.js").サーバー} サーバー
   * @param {キャラクター} キャラクター
   */
  constructor(サーバー, キャラクター) {
    super(サーバー);
    this.#キャラクター = キャラクター;
    this.#武器 = new 装備スロット(キャラクター, 武器);
    this.#防具 = new 装備スロット(キャラクター, 防具);
    this.#道具 = new 装備スロット(キャラクター, 道具);
  }

  /**
   * @param {アイテム} アイテム
   * @returns {?装備スロット}
   */
   アイテムからスロットを取得(アイテム) {
    if (アイテム instanceof 武器) {
      return this.#武器;
    }
    if (アイテム instanceof 防具) {
      return this.#防具;
    }
    if (アイテム instanceof 道具) {
      return this.#道具;
    }
    throw new TypeError(`${アイテム.名前}は装備できないアイテムです`);
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

  get 武器() { return this.#武器; }
  get 防具() { return this.#防具; }
  get 道具() { return this.#道具; }

  #キャラクター;
  /**
   * @type {装備スロット}
   */
  #武器;
  /**
   * @type {装備スロット}
   */
  #防具;
  /**
   * @type {装備スロット}
   */
  #道具;
}