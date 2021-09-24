// @ts-check
"use strict";

import { キャラクター } from "../character/Character.js";
import { 一般的な場所 } from "./General.js"

/**
 * @typedef {import("../character/Character.js").メンバー} プレイヤー
 */

export class 命名の館 extends 一般的な場所 {
  get 背景画像() { return "name_change.gif"; }
  get キャラクター() { return new キャラクター(this.サーバー, "@ﾏﾘﾅﾝ", "chr/017.gif"); }

  /**
   * @param {プレイヤー} プレイヤー
   * @param {any} 性別
   */
  #性転換(プレイヤー, 性別) {
    if (this.#性転換チェック(性別)) {
      return;
    }
    this.NPCに話させる(`${プレイヤー.性別}をやめて${性別}として生きていくのだな。それでは…カッ！！<br />${プレイヤー.名前}は今から女としての人生の始まりじゃ`);
    プレイヤー.軌跡.書き込む(`${プレイヤー.性別}をやめて${性別}として生まれ変わる`);
    プレイヤー.性別 = 性別;
    プレイヤー.アイコンをリセット();
    プレイヤー.所持金.収支(- 命名の館.#性転換手数料);
  }

  #性転換チェック(プレイヤー, 性別) {
    try {
      if (プレイヤー.性別 === 性別)
        throw `${this._NPC.名前}「すでに${プレイヤー.名前}は${性別}じゃぞ」`;
      if (プレイヤー.所持金.所持 < 命名の館.#名前変更手数料)
        throw `${this._NPC.名前}「${性別}に性転換するためのお金が足りぬぞ」`;
      if (プレイヤー.現職.性別 !== 性別)
        throw `${this._NPC.名前}「職業が ${プレイヤー.現職} は性転換することはできぬぞ」`;
    }
    catch (エラー) {
      通知欄.追加(エラー);
      return true;
    }
    return false;
  }

  static #名前変更手数料 = 500_000;
  static #性転換手数料 = 10_000;
}