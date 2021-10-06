// @ts-check
"use strict";

import { 一般的な場所 } from "./General.js";
import { 場所 } from "./Place.js"
import { キャラクター } from "../character/Character.js"
import { PlaceActionCommand } from "../command/PlaceActionCommand.js";
import { PlaceCommandGroup } from "../command/PlaceCommandGroup.js";
import { 酒場メニュー } from "../item/BarMenu.js"
import { ランダムな1要素 } from "../Util.js";

/**
 * @typedef {import("../character/Member.js").メンバー} プレイヤー
 */

export class ルイーダの酒場 extends 一般的な場所 {
  /**
   * 
   * @param {プレイヤー} プレイヤー 
   */
  ヘッダー出力(プレイヤー) {
    return `${this._ヘッダー用出力(undefined, false)}ゴールド：${プレイヤー.所持金.ヘッダー用出力()}G${プレイヤー.ステータス.ヘッダー用2ステータス出力()}`;
  }
  
  /**
   * 
   * @param {プレイヤー} プレイヤー 
   * @param {string} メニュー名 
   * @returns 
   */
  ちゅうもん(プレイヤー, メニュー名) {
    const _メニュー = 酒場メニュー.一覧.get(メニュー名 === プレイヤー.好物 ? "ﾌﾙｺｰｽ" : メニュー名);
    if (メニュー名 === undefined || _メニュー === undefined) {
      通知欄.追加("注文は何にするのかしら？");
      通知欄.追加(酒場メニュー.陳列棚出力(酒場メニュー.一覧.values(), "ちゅうもん"));
      return;
    }
    if (!_メニュー.注文(プレイヤー)) {
      通知欄.追加("お金が足りないみたいね");
      return;
    }
    プレイヤー.現在地.NPCに話させる(_メニュー.出力(メニュー名 === プレイヤー.好物 ? プレイヤー.好物 : undefined));
  }

  get 背景画像() { return "bar.gif"; }
  get NPC() { return new キャラクター(this.サーバー, "@ﾙｲｰﾀﾞ", "chr/009.gif"); }
  
  /**
   * 
   * @param {プレイヤー} プレイヤー 
   */
   _はなす(プレイヤー) {
    super._はなす(
      "いらっしゃい。何か食べてく？",
      `${プレイヤー.名前}さんは${ランダムな1要素(Array.from(酒場メニュー.一覧.values())).名前}は好きかしら？`,
      "食材にＭＰを回復させる魔法の聖水やＨＰを回復させる薬草がふくまれているのよ",
      "ＨＰを回復させたいならデザートやご飯物を食べていくといいわ",
      "ＭＰを回復させたいならドリンクを飲んでいくといいわ",
      "食べたり飲んだりした後は、運動しなきゃね",
      "お酒は大人になってからね"
    );
  }

  static get コマンド() { return this.#コマンド ?? this.#コマンドを登録(); }

  static #コマンドを登録() {
    this.#コマンド = new PlaceCommandGroup("bar", "ルイーダの酒場");
    this.#コマンド.追加(
      new PlaceActionCommand("order", this.prototype.ちゅうもん)
        .引数追加("STRING", "menu", "メニュー", false)
    );
    return this.#コマンド;
  }

  /**
   * @type {PlaceCommandGroup}
   */
  static #コマンド;
}
