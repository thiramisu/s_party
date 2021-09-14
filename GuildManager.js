// @ts-check
"use strict";

import { 基底 } from "./Base.js"

/**
 * @typedef {import("./Guild.js").ギルド} ギルド
 */

export class ギルドマネージャー extends 基底{
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

  追加() {

  }

  必要なら一覧出力() {

  }
  
  #一覧;
}