// @ts-check
"use strict";

import { メンバー } from "../character/Character.js"

export class PlaceActionCommand {
  /**
   * 
   * @param {*} 英語行動名 
   * @param {*} 日本語行動名 
   * @param {(メンバー: メンバー) => void | boolean} 効果 
   */
  constructor(英語行動名, 日本語行動名, 効果) {
    this.#効果 = 効果;
    [].map
  }

  
  /**
   * @param {メンバー} メンバー
   */
  実行(メンバー) {
    this.#効果(メンバー);
  }

  #効果;
}