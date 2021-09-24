// @ts-check
"use strict";

import { 一般的な場所 } from "./General.js"
import { 預かり所 } from "./Depot.js"
import { キャラクター } from "../character/Character.js";
import { PlaceCommandGroup } from "../command/PlaceCommandGroup.js";
import { PlaceActionCommand } from "../command/PlaceActionCommand.js";

export class オークション会場 extends 一般的な場所 {
  get 背景画像() { return "auction.gif"; }
  get NPC() { return new キャラクター(this.サーバー, "@ﾜｲﾙﾄﾞ", "chr/012.gif"); }

  // TODO どれを(誰|だれ)に送(りますか|る)？

  static get コマンド() { return this.#コマンド ?? this.#コマンドを登録(); }

  static #コマンドを登録() {
    this.#コマンド = new PlaceCommandGroup("auction", "オークション会場");
    this.#コマンド.追加(
      new PlaceActionCommand("send", 預かり所.prototype.おくる)
        .引数追加("STRING", "item", "あいてむ", false)
        .引数追加("STRING", "item", "あいて", false)
    );
    return this.#コマンド;
  }

  /**
   * @type {PlaceCommandGroup}
   */
  static #コマンド;
}