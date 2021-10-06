// @ts-check
"use strict";

import { 基底 } from "../Base.js"

/**
 * @typedef {import("../item/AlchemyRecipe.js").錬金レシピ} 錬金レシピ
 */

export class プレイヤー錬金レシピマネージャー extends 基底 {
  /**
   * @param {import("../Server.js").サーバー} サーバー
   * @param {import("./Member.js").メンバー} プレイヤー
   */
  constructor(サーバー, プレイヤー) {
    super(サーバー);
    this.#プレイヤー = プレイヤー;
    this.#完成済み = false;
    this.#習得済みレシピリスト = new Set();
    this.#作成済みレシピリスト = new Set();
  }

  /**
   * 
   * @param {錬金レシピ} 錬金レシピ 
   */
  習得(錬金レシピ) {
    this.#習得済みレシピリスト.add(錬金レシピ);
  }

  /**
   * 
   * @param {錬金レシピ} 錬金レシピ 
   * @returns {boolean} 習得していなければfalse
   */
  錬金を開始(錬金レシピ) {
    if (!this.#習得済みレシピリスト.has(錬金レシピ)) {
      return false;
    }
    return true;
  }

  錬金を完了() {
    if (this.#錬金中レシピ === undefined) {
      return;
    }
    this.#完成済み = true;
  }

  /**
   * 
   * @returns {?錬金レシピ} 完成していなければnull
   */
  完成品を受け取る() {
    if (!this.#完成済み) {
      return null;
    }
    const レシピ = this.#錬金中レシピ;
    this.#プレイヤー.アイテム倉庫.追加(レシピ.完成品);
    this.#プレイヤー.実績.錬金ポイント増加();
    this.#作成済みレシピリスト.add(レシピ);
    this.#錬金中レシピ = undefined;
    this.#完成済み = false;
    return レシピ;
  }

  #プレイヤー;
  /**
   * @type {錬金レシピ}
   */
  #錬金中レシピ;
  #完成済み;
  /**
   * @type {Set<錬金レシピ>}
   */
  #習得済みレシピリスト;
  /**
   * @type {Set<錬金レシピ>}
   */
  #作成済みレシピリスト;
}