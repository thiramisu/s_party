"use strict";

import { サーバー } from "./Server"

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