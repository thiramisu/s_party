// @ts-check
"use strict";

import { 陳列可能インターフェース } from "./ItemInterface.js";
import { 空文字列 } from "../Util.js";

/**
 * @typedef {import("../character/Character.js").メンバー} プレイヤー
 */

export class 酒場メニュー extends 陳列可能インターフェース {
  /**
   * @param {string} 名前
   * @param {number} 値段
   * @param {number} ＨＰ
   * @param {number} ＭＰ
   * @param {number} 福引券
   */
  constructor(名前, 値段, ＨＰ, ＭＰ, 福引券) {
    super(名前);
    this.#値段 = 値段;
    this.#ＨＰ = ＨＰ;
    this.#ＭＰ = ＭＰ;
    this.#福引券 = 福引券;
  }

  /**
   * 
   * @param {プレイヤー} プレイヤー 
   * @param {string} 名前 
   * @returns 
   */
  出力(プレイヤー, 名前 = this.名前) {
    return `おまたせ、${名前}よ♪${this.#ＨＰ ? `${プレイヤー.名前}のＨＰが回復した！` : 空文字列
      }${this.#ＭＰ ? `${プレイヤー.名前}のＭＰが回復した！` : 空文字列
      }福引券を${this.#福引券}枚もらった！`;
  }

  /**
   * 
   * @param {プレイヤー} プレイヤー 
   * @returns 所持金が足りて注文できたならtrue
   */
  注文(プレイヤー) {
    if (!プレイヤー.所持金.収支(-this.#値段)) {
      return false;
    }
    const ステータス = プレイヤー.ステータス;
    ステータス.ＨＰ.現在値 += this.#ＨＰ;
    ステータス.ＭＰ.現在値 += this.#ＭＰ;
    プレイヤー._福引券.収支(this.#福引券);
    プレイヤー.ギルド?.ポイント増加(2);
    return true;
  }

  static get 一覧() { return this.#一覧; }

  static 初期化() {
    this.#一覧 = new Map([
      new this("ｱﾓｰﾙの水", 10, 40, 0, 1),
      new this("ｵﾚﾝｼﾞｼﾞｭｰｽ", 50, 0, 30, 1),
      new this("ﾄﾏﾄｼﾞｭｰｽ", 100, 10, 80, 2),
      new this("ｺｰﾋｰ", 200, 0, 250, 3),
      new this("ﾊｰﾌﾞﾃｨｰ", 500, 0, 500, 5),
      new this("ｱｲｽｸﾘｰﾑ", 100, 30, 30, 2),
      new this("ﾌﾟﾘﾝ", 200, 60, 0, 3),
      new this("ﾊﾟﾌｪ", 300, 100, 100, 4),
      new this("ｶﾚｰﾗｲｽ", 400, 250, 0, 5),
      new this("ｽﾊﾟｹﾞﾃｨ", 600, 300, 50, 6),
      new this("ｵﾑﾗｲｽ", 750, 500, 100, 7),
      new this("ﾊﾝﾊﾞｰｸﾞ", 900, 800, 0, 8),
      new this("ｽﾃｰｷ", 1000, 999, 0, 10),
      new this("ﾌﾙｺｰｽ", 3000, 999, 999, 15)
    ].map((メニュー) => [メニュー.名前, メニュー]));
  }

  _陳列用出力() {
    return super._陳列用出力("ちゅうもん", this.名前, `${this.#値段} G`);
  }

  #値段;
  #ＨＰ;
  #ＭＰ;
  #福引券;

  static _陳列用ヘッダー項目名リスト = ["名前", "値段"];

  /**
   * @type {Map<string, 酒場メニュー>}
   */
  static #一覧;
}