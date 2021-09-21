// @ts-check
"use strict";

import { PlaceActionCommand } from "./PlaceActionCommand.js";

export class PlaceCommandGroup {
  /**
   * @param {string} 英語場所名 サブコマンドグループ名に使われる
   * @param {string} 日本語場所名 サブコマンドグループの説明に使われる
   */
  constructor(英語場所名, 日本語場所名) {
    this.#英語場所名 = 英語場所名;
    this.#日本語場所名 = 日本語場所名;
  }

  実行() {

  }

  /**
   * 
   * @param {PlaceActionCommand[]} コマンドリスト
   */
  追加(...コマンドリスト) {
    for (const コマンド of コマンドリスト)
      this.#コマンドリスト.push(コマンド);
    return this;
  }

  オプションへ() {
    return {
      type: "SUB_COMMAND",
      name: this.#英語場所名,
      description: this.#日本語場所名,
      options: this.#コマンドリスト.map(this.#コマンドリストをオプションリストへ)
    };
  }

  /**
   * 
   * @param {PlaceActionCommand} コマンド 
   */
  #コマンドリストをオプションリストへ(コマンド) {
    return コマンド.オプションへ();
  }

  /**
   * @type {Array<PlaceActionCommand>}
   */
  #コマンドリスト;
  #英語場所名;
  #日本語場所名;
}