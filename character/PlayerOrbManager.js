// @ts-check
"use strict";

import { 基底 } from "../Base.js"

// TODO ビットフラグ

class プレイヤーオーブマネージャー extends 基底 {
  /**
   * @param {import("../Server.js").サーバー} サーバー
   * @param {import("./Member.js").メンバー} プレイヤー
   */
  constructor(サーバー, プレイヤー) {
    super(サーバー);
    this.#プレイヤー = プレイヤー;
  }

  #プレイヤー;
}