// @ts-check
"use strict";

import { 基底 } from "../Base.js"

const 最大アイテム預かり個数 = 0;
const アイテム預かり個数の計算式 = (/** @type {number} */ 転職回数) => { return 20 + 転職回数 * 5; }
const 最大モンスター預かり体数 = 0;

class 倉庫 extends 基底 {
  /**
   * @param {import("../Server.js").サーバー} サーバー
   * @param {import("./Character.js").メンバー} プレイヤー
   */
  constructor(サーバー, プレイヤー) {
    super(サーバー);
    this.#プレイヤー = プレイヤー;
    this.#内容 = [];
  }

  /**
   * @param {string} アイテム名
   */
  追加(アイテム名) {
    this.#内容.push(アイテム名);
  }

  /**
   * 
   * @param {string} アイテム名 
   */
  削除(アイテム名) {
    this.#内容.splice(this.#内容.indexOf(アイテム名), 1);
  }

  引き出す() {

  }

  預ける() {

  }

  は満杯() {
    return Math.min(最大アイテム預かり個数, アイテム預かり個数の計算式(this.#プレイヤー.転職回数));
  }

  /**
   * 
   * @param {string} アイテム名 
   * @returns {boolean}
   */
  にある(アイテム名) {
    return this.#内容.includes(アイテム名);
  }

  /**
   * 最大
   * @interface
   */
  get 最大() { return 0; }
  get プレイヤー() { return this.#プレイヤー; }

  #プレイヤー;
  #内容;
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
