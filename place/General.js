// @ts-check
"use strict";

import { PlaceActionCommand } from "../command/PlaceActionCommand.js";
import { PlaceCommandGroup } from "../command/PlaceCommandGroup.js";
import { 場所 } from "./Place.js";

/**
 * @typedef {import("../character/Character.js").メンバー} プレイヤー
 * 
 */

const いどう先の表示で改行する項目数 = 25;

export class 一般的な場所 extends 場所 {
  /**
   * @param {プレイヤー} プレイヤー
   * @param {string} 移動先場所名
   */
  いどう(プレイヤー, 移動先場所名) {
    this.#移動(プレイヤー, 移動先場所名);
  }

  /**
   * @param {プレイヤー} プレイヤー
   * @param {string} 移動先場所名
   */
  まち(プレイヤー, 移動先場所名) {
    this.#移動(プレイヤー, 移動先場所名, 場所._訪問方法.まち, "まち", "どの町に行きますか？");
  }

  /**
   * @param {プレイヤー} プレイヤー
   * @param {プレイヤー} 対象プレイヤー
   */
  ほーむ(プレイヤー, 対象プレイヤー) {
    プレイヤー.プレイヤーの家に移動(対象プレイヤー);
  }

  /**
   * @param {プレイヤー} プレイヤー
   */
  ぎるど(プレイヤー) {
    if (プレイヤー.ギルド === undefined) {
      console.log("ギルド協会でギルドに参加すると使えるようになります");
      // TODO 移動コマンド？
      return;
    }
    console.log("guild");
  }

  /**
   * @param {プレイヤー} プレイヤー
   * @param {プレイヤー} 対象プレイヤー
   */
  ささやき(プレイヤー, 対象プレイヤー) {
    console.log("ささやき");
  }

  /**
   * @param {プレイヤー} プレイヤー
   */
  はなす(プレイヤー) {
    プレイヤー.現在地._はなす();
  }

  /**
   * @param {プレイヤー} プレイヤー
   * @param {string} 対象
   */
  しらべる(プレイヤー, 対象) {
    プレイヤー.チャット書き込み停止();
    if (プレイヤー.現在地._NPC?.名前 === 対象) {
      プレイヤー.現在地._NPCをしらべる();
      return;
    }
    console.log("プレイヤーデータ");
  }

  /**
   * @param {プレイヤー} プレイヤー
   */
  ろぐあうと(プレイヤー) {
    プレイヤー.ろぐあうと();
  }

  /**
   * @param {プレイヤー} プレイヤー
   */
  すくしょ(プレイヤー) {
    console.log("syo");
  }

  /**
   * @param {プレイヤー} プレイヤー
   */
  ボーナス(プレイヤー) {
    プレイヤー.所持金.収支(10000);
    プレイヤー.カジノコイン.収支(10000);
    プレイヤー._福引券.収支(1000);
    プレイヤー._レアポイント.収支(10);
    プレイヤー._小さなメダル.収支(100);
  }

  /**
   * @type {string}
   */
  get 背景画像() { return ""; }
  /**
   * @type {boolean}
   */
  get 移動可能() { return true; }
  
  static get コマンド() { return this.#コマンド ?? this.#コマンドを登録(); }

  #移動(プレイヤー, 移動先場所名, 訪問方法 = 場所._訪問方法.いどう, こうどう名 = "いどう", 通知 = "どこに移動しますか？") {
    if (!new Set(場所.全場所名(訪問方法)).has(移動先場所名)) {
      // 移動先候補表示
      const 断片 = document.createDocumentFragment();
      let 改行を挟む = 0;
      断片.append(通知, document.createElement("br"));
      for (const 場所名 of 場所.全場所名(訪問方法)) {
        const span = document.createElement("span");
        span.textContent = `${場所名} `;
        チャットフォーム.文字列追加イベントを登録(span, `＠${こうどう名}>${場所名} `);
        断片.append(span, "/ ");
        if (++改行を挟む % いどう先の表示で改行する項目数 === 0) {
          断片.appendChild(document.createElement("br"));
        }
      }
      通知欄.追加(断片);
      return;
    }
    const 移動先 = 場所.一覧(移動先場所名);
    if (プレイヤー.現在地 === 移動先) {
      通知欄.追加(`ここが${移動先.名前}です`);
      return;
    }
    プレイヤー.チャット書き込み停止();
    プレイヤー.場所移動(移動先);
  }

  static #コマンドを登録() {
    return new PlaceCommandGroup("general", "全般").追加(
      new PlaceActionCommand("move", this.prototype.いどう),
      new PlaceActionCommand("town", this.prototype.まち),
      new PlaceActionCommand("home", this.prototype.ほーむ)
        .引数追加("USER", "player", "プレイヤー", false),
      new PlaceActionCommand("guild", this.prototype.ぎるど),
      new PlaceActionCommand("whisper", this.prototype.ささやき),
      new PlaceActionCommand("talk", this.prototype.はなす),
      new PlaceActionCommand("search", this.prototype.しらべる),
      new PlaceActionCommand("log-out", this.prototype.ろぐあうと),
      new PlaceActionCommand("screen-shot", this.prototype.すくしょ),
      new PlaceActionCommand("bonus", this.prototype.ボーナス)
    );
  }

  /**
   * @type {PlaceCommandGroup}
   */
  static #コマンド;
  _一般的なこうどう;
}
