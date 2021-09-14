// @ts-check
"use strict";

import { 基底 } from "../Base.js"

const 最大アイテム預かり個数 = 0;
const 最大モンスター預かり体数 = 0;
  
class 倉庫 extends 基底 {
  /**
   * @param {import("../Server.js").サーバー} サーバー
   * @param {} プレイヤー
   */
  constructor(サーバー, プレイヤー) {
    super(サーバー);
    this.#プレイヤー = プレイヤー;
  }

  追加() {

  }

  引き出す() {

  }

  預ける() {

  }

  は満杯() {

  }

  /**
   * 最大
   * @interface
   */
  get 最大() { return 0; }
  get プレイヤー() { return this.#プレイヤー; }

  #プレイヤー;
}

export class アイテム倉庫 extends 倉庫 {
  get 最大() {
    return Math.max(最大アイテム預かり個数, this.プレイヤー.転職回数 * 5 + 5);
  }
}

export class モンスター倉庫 extends 倉庫 {
  get 最大() {
    return 最大モンスター預かり体数;
  }
}
