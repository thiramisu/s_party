// @ts-check
"use strict";

import { キャラクター } from "../character/Character.js";
import { PlaceActionCommand } from "../command/PlaceActionCommand.js";
import { PlaceCommandGroup } from "../command/PlaceCommandGroup.js";
import { アイテム } from "../item/Item.js";
import { 一般的な場所 } from "./General.js"
import { 場所 } from "./Place.js";

/** 
 * @typedef {import("../character/Character.js").メンバー} プレイヤー
 */

const 売値係数 = 0.5;

export class 預かり所 extends 一般的な場所 {
  /**
   * @param {プレイヤー} プレイヤー
   * @param {string} アイテム名
   */
  うる(プレイヤー, アイテム名) {
    if (アイテム名 === undefined || !プレイヤー.アイテム倉庫.削除(アイテム名)) {
      通知欄.追加("どれを売りますか？", "$p");
      return;
    }
    const 販売価格 = Math.floor(アイテム.一覧(アイテム名).価値 * 0.5);
    this.NPCに話させる(`${アイテム名} の買取代の ${販売価格} Gです！`);
    /* $ites[$no][1] $buy_price G /  */
  }

  /**
   * 
   * @param {プレイヤー} プレイヤー 
   */
  あずける(プレイヤー) {

  }

  /**
   * 
   * @param {プレイヤー} プレイヤー 
   */
  ひきだす(プレイヤー) {
  }

  /**
   * 
   * @param {プレイヤー} プレイヤー 
   */
  おくる(プレイヤー) {

  }

  get 背景画像() { return "depot.gif"; }
  get NPC() { return new キャラクター(this.サーバー, "@ﾆｷｰﾀ", "chr/003.gif"); }

  /**
   * 
   * @param {プレイヤー} プレイヤー 
   */
  _はなす(プレイヤー) {
    super._はなす(
      `ここは${this.名前}だけど、何か用かい？`,
      `${プレイヤー}は、最大${プレイヤー.アイテム倉庫.最大}個まで預けることができるぜ`,
      "転職回数が増えるごとに預けられる個数も増えていくぜ",
      "＠おくる時は、送るアイテムと相手の名前を教えてくれな",
      "＠せいとんすると、武器、防具、道具の順に整頓できるぜ",
      "預かり所がまんぱんだと、相手からのアイテムが受け取れないぜ",
      "預かり所がまんぱんだと、クエストでの宝物を手に入れることができないぜ",
      "ここで売るのも専門店で売るのも売値は変わらないぜ"
    );
  }

  /**
   * 
   * @param {プレイヤー} プレイヤー 
   */
  ヘッダー出力(プレイヤー) {
    return `${this._ヘッダー用出力()
      }倉庫：${999}/${99999
      } / ${プレイヤー.ヘッダー用出力()}`;
  }

  static get コマンド() { return this.#コマンド ?? this.#コマンドを登録(); }

  static #コマンドを登録() {
    this.#コマンド = new PlaceCommandGroup("depot", "預かり所");
    this.#コマンド.追加(
      new PlaceActionCommand("sell", this.prototype.うる)
        .引数追加("STRING", "item", "アイテム", false),
      new PlaceActionCommand("in", this.prototype.あずける),
      new PlaceActionCommand("out", this.prototype.ひきだす),
      new PlaceActionCommand("send", this.prototype.おくる)
    );
    return this.#コマンド;
  }

  /**
   * @type {PlaceCommandGroup}
   */
  static #コマンド;
}
