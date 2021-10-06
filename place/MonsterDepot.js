// @ts-check
"use strict";

import { 一般的な場所 } from "./General.js";
import { PlaceCommandGroup } from "../command/PlaceCommandGroup.js";
import { PlaceActionCommand } from "../command/PlaceActionCommand.js";
import { キャラクター } from "../character/Character.js";

/**
 * @typedef {import("../character/Member.js").メンバー} プレイヤー
 */

export class モンスターじいさん extends 一般的な場所 {
  /**
   * @param {プレイヤー} プレイヤー
   * @param {string} モンスター名
   */
  つれてく(プレイヤー, モンスター名) {
    const モンスター = プレイヤー.モンスター倉庫.取得(モンスター名);
    if (モンスター === null) {
      const $mes = `どのモンスターを連れて行くのじゃ？<br />$p`;
      const $p = `<span onclick="text_set('＠つれてく>$name ')"><img src="$icondir/$icon" />$name</span> `;
      return;
    }
    try {
      プレイヤー.ほーむメンバー.追加(モンスター);
      this.NPCに話させる("$nameを$mの家に送っておいたぞ");
    }
    catch (e) {
      const $mes = ` <span onclick="text_set('＠なづける>$add_name＠なまえ>')">$mの家に同じ名前のモンスターがいます。「＠なづける」で名前を変えてください</span> `;
      const $mes2 = "これ以上、モンスターを家に連れて行くことはできません";
      通知欄.追加(e);
    }
  }

  なづける(プレイヤー, モンスター名, 名前) {

  }

  あずける(プレイヤー) {

  }

  おくる(プレイヤー, モンスター名, 宛て先) {

  }

  わかれる(プレイヤー, モンスター名) {

  }

  get 背景画像() { return "farm.gif"; }
  get NPC() { return new キャラクター(this.サーバー, "@ﾓﾝｼﾞｨ", "chr/013.gif"); }

  static get コマンド() { return this.#コマンド ?? this.#コマンドを登録(); }

  static #コマンドを登録() {
    this.#コマンド = new PlaceCommandGroup("park", "モンスターじいさん");
    this.#コマンド.追加(
      new PlaceActionCommand("take", this.prototype.つれてく)
        .引数追加("STRING", "name", "名前", false),
      new PlaceActionCommand("rename", this.prototype.なづける)
        .引数追加("STRING", "monster", "もんすたー", false)
        .引数追加("STRING", "name", "なまえ", false),
      new PlaceActionCommand("fortune", this.prototype.あずける),
      new PlaceActionCommand("send", this.prototype.おくる)
        .引数追加("USER", "to", "あいて", false),
      new PlaceActionCommand("bye", this.prototype.わかれる),
    );
    return this.#コマンド;
  }

  /**
   * @type {PlaceCommandGroup}
   */
  static #コマンド;
}