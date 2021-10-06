// @ts-check
"use strict";

import { 一般的な場所 } from "./General.js"
import { PlaceCommandGroup } from "../command/PlaceCommandGroup.js";
import { PlaceActionCommand } from "../command/PlaceActionCommand.js";
import { キャラクター } from "../character/Character.js";
import { ランダムな1要素 } from "../Util.js";

/**
 * @typedef {import("../character/Member.js").メンバー} プレイヤー
 */

export class 交流広場 extends 一般的な場所 {
  /**
   * @param {プレイヤー} プレイヤー
   */
   うらない(プレイヤー) {
    this.NPCに話させる(`今日の${プレイヤー.名前}さんの運勢はずばり…${ランダムな1要素([
      "大吉", "吉", "中吉", "末吉", "小吉", "凶", "大凶",
      "大吉", "吉", "中吉", "末吉", "小吉", "凶", "大凶",
      "ハッピー", "アンハッピー", "オッパピー", "残念", "頑張って", "愛があります", "開き直ってください", "何か起きます"
    ])}です♪ラッキーカラーは${ランダムな1要素([
      "黒", "白", "青", "赤", "空", "ピンク", "紫", "緑", "灰", "ブルー", "水", "肌", "オレンジ", "黄", "茶", "ワインレッド", "猫",
      "海", "土", "森", "藍", "杏子", "イチゴ", "オリーブ", "金", "銀", "パール"
    ])}色ですよ～。`);
  }

  get 背景画像() { return "park.gif"; }
  get NPC() { return new キャラクター(this.サーバー, "@町娘", "chr/001.gif"); }
  
  /**
   * @param {プレイヤー} プレイヤー
   */
  _はなす(プレイヤー) {
    super._はなす(
      `${プレイヤー.名前}さんこんにちわ`,
      "今日はいい天気ですね～",
      "夕方からはお天気が悪くなるみたいですよ",
      `今日の夕飯は何を作ろうかしら。${プレイヤー.名前}さんはどんな食べ物が好きですか？`,
      `あら、${プレイヤー.名前}さん♪今日も元気そうですね`,
      "これからどこに行くんですか？",
      `${プレイヤー.名前}さんを占ってあげましょう`,
      "私の占いって結構当たるらしいですよ",
      "趣味は占いです",
      `${プレイヤー.名前}さんの職業は${プレイヤー.現職.名前}ですね？どうですか？当たりですか？`
    );
  }

  /**
   * @param {プレイヤー} _プレイヤー
   */
  _NPCをしらべる(_プレイヤー) {
    super._はなす([
      "何かお探しですか？",
      "メガネメガネ…",
      "はい！メガネ！",
      "お探し物はこれですか？-Ｏ-Ｏ-",
      "キャッ！何しているんですか！"
    ]);
  }
  
  static get コマンド() { return this.#コマンド ?? this.#コマンドを登録(); }

  static #コマンドを登録() {
    this.#コマンド = new PlaceCommandGroup("park", "交流広場");
    this.#コマンド.追加(
      new PlaceActionCommand("fortune", this.prototype.うらない)
    );
    return this.#コマンド;
  }

  /**
   * @type {PlaceCommandGroup}
   */
  static #コマンド;
}