// @ts-check
"use strict";

import { 基底 } from "./Base.js";
import { ギルド } from "./Guild.js";

export class ギルドマネージャー extends 基底 {
  /**
   * @param {import("./Server.js").サーバー} サーバー
   */
  constructor(サーバー) {
    super(サーバー);
    /**
     * @type {Map<string, ギルド>} 
     */
    this.#一覧 = new Map();
  }

  /**
   * @param {string} ギルド名 
   */
  設立(ギルド名) {
    // TODO ギルド名の妥当性チェック
    this.#一覧.set(ギルド名, new ギルド(this.サーバー, ギルド名))
  }

  /**
   * @param {string} ギルド名 
   */
  削除(ギルド名) {
    this.#一覧.delete(ギルド名);
  }

  存在する(ギルド名) {
    return this.#一覧.has(ギルド名);
  }

  必要なら一覧出力() {

  }

  自動削除チェック() {
    for (const ギルド of this.#一覧.values()) {
      // TODO 本家だとメンバーの出入りだがシステム上難しい
      if (更新日時.取得() > 最終更新日時 + ギルド自動削除日数 * 3600 * 24) {
        ギルド.解散();
      }
    }
  }

  /**
   * @type {Map<string, ギルド>}
   */
  #一覧;
}