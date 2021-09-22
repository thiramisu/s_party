// @ts-check
"use strict";

/**
 * @typedef {import("./Server.js").サーバー} サーバー
 */

export class 基底 {
  /**
   * 
   * @param {サーバー} サーバー 
   */
  constructor(サーバー) {
    this.#サーバー = サーバー;
  }

  get サーバー() { return this.#サーバー; }

  /**
   * @type {サーバー}
   */
  #サーバー;
}