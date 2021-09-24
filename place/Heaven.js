// @ts-check
"use strict";

import { 一般的な場所 } from "./General.js"
import { キャラクター } from "../character/Character.js";

/**
 * @typedef {import("../character/Character.js").メンバー} プレイヤー
 */

export class 天界 extends 一般的な場所 {
  ヘッダー出力() {
    return this._ヘッダー用出力(undefined, false);
  }

  get 背景画像() { return "god.gif"; }
  get NPC() { return new キャラクター(this.サーバー, "@神", "chr/052.gif"); }
  get 移動可能() { return false; }

  _NPCをしらべる() {
    通知欄.追加(`${this._NPC.名前}「本当の願いは自分の力で叶えるのだ…」`, "＠ねがう>メイドを雇いたい");
  }

  /**
   * @param {プレイヤー} プレイヤー
   */
  _はなす(プレイヤー) {
    super._はなす(`${プレイヤー.名前}よ。よくぞここまできた。${プレイヤー.名前}の願いを一つだけ叶えてやろう`);
  }
}