// @ts-check
"use strict";

import { 一般的な場所 } from "./General.js"
import { キャラクター } from "../character/Character.js";
import { 簡易ステータス } from "../character/Status.js";

/**
 * @typedef {import("../character/Member.js").メンバー} プレイヤー
 */

export class 願いの泉 extends 一般的な場所 {
  /**
   * @param {プレイヤー} プレイヤー
   * @param {number} SP INTEGER
   */
  ＨＰ(プレイヤー, SP) {
    this.#ささげる(プレイヤー, SP, 簡易ステータス.ＨＰ(2));
  }

  /**
   * @param {プレイヤー} プレイヤー
   * @param {number} SP INTEGER
   */
  ＭＰ(プレイヤー, SP) {
    this.#ささげる(プレイヤー, SP, 簡易ステータス.ＭＰ(2));
  }

  /**
   * @param {プレイヤー} プレイヤー
   * @param {number} SP INTEGER
   */
  攻撃力(プレイヤー, SP) {
    this.#ささげる(プレイヤー, SP, 簡易ステータス.攻撃力(1));
  }

  /**
   * @param {プレイヤー} プレイヤー
   * @param {number} SP INTEGER
   */
  守備力(プレイヤー, SP) {
    this.#ささげる(プレイヤー, SP, 簡易ステータス.守備力(1));
  }

  /**
   * @param {プレイヤー} プレイヤー
   * @param {number} SP INTEGER
   */
  素早さ(プレイヤー, SP) {
    this.#ささげる(プレイヤー, SP, 簡易ステータス.素早さ(1));
  }

  /**
   * @param {プレイヤー} プレイヤー
   */
  ヘッダー出力(プレイヤー) {
    const 職業 = プレイヤー.現職;
    return `${super._ヘッダー用出力()}${職業.名前} SP<b>${職業.SP}</b>|;
      for my $k (qw/lv mＨＰ mＭＰ at df ag/) {
        print qq| $e2j{$k}<b>$m{$k}</b>|;
      }
      `;
  }

  get 背景画像() { return "sp_change.gif"; }
  get NPC() { return new キャラクター(this.サーバー, "@女神", "chr/011.gif") }

  _はなす() {
    super._はなす(
      "スキルポイントはレベルが上がるごとに１ポイント増えていくのです",
      "スキルポイントを早く上げるコツは、何度も同じ職業に転職することです",
      "$mのスキルポイントは現在 $m{sp} ポイントです",
      "スキル習得を目指している場合は、ささげずにとっておくのですよ",
      "スキルポイントをささげるのです",
      "スキルポイントのお礼に、$mのステータスを上げてあげましょう",
      "一度ささげたスキルポイントを戻すことはできません",
      "スキルポイントは、その職業のスキルを習得するのに必要です"
    );
  }

  /**
   * @param {プレイヤー} プレイヤー
   * @param {number} SP INTEGER
   * @param {any} 増加ステータス
   */
  #ささげる(プレイヤー, SP, 増加ステータス) {
    // TODO 数値への変換がデフォと違うかも
    if (SP < 1) {
      this._クリック時効果();
      return;
    }
    if (!プレイヤー.現職.SP増減(-SP)) {
      通知欄.追加("ささげるSPが足りません");
      return;
    }
    プレイヤー.ステータス.成長(増加ステータス);
    this.NPCに話させる(`SP ${SP} のかわりに $e2j{$k} を $v あたえましょう`);
  }

  static _クリック時効果() {
    通知欄.追加("SPをいくつささげますか？例＞『＠ＨＰ>1』SPを１ささげＨＰを上げる");
  }

  static #整数でない文字列か = new RegExp(/[^0-9]/);
}