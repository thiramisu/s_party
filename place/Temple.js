// @ts-check
"use strict";

import { 一般的な場所 } from "./General.js"
import { 転職可能な職業 } from "../character/Job.js";
import { PlaceActionCommand } from "../command/PlaceActionCommand.js";
import { PlaceCommandGroup } from "../command/PlaceCommandGroup.js";
import { キャラクター } from "../character/Character.js";

/**
 * @typedef {import("../character/Character.js").メンバー} プレイヤー
 */

export class ダーマ神殿 extends 一般的な場所 {
  /**
   * 
   * @param {プレイヤー} プレイヤー 
   * @param {string} 職業名 
   * @returns 
   */
  てんしょく(プレイヤー, 職業名) {
    const _職業 = 転職可能な職業.一覧(職業名, false);
    if (!_職業?.に転職できる(プレイヤー)) {
      通知欄.追加([
        `どの職業に転職するのじゃ？`,
        転職可能な職業.転職先候補出力(プレイヤー)
      ]);
      return;
    }
    const アイテム名 = プレイヤー.転職(_職業);
    if (アイテム名 !== undefined) {
      this.NPCに話させる(`${アイテム名}を使いました！ `);
    }
    this.NPCに話させる(`${プレイヤー.名前}よ！${職業名}となり新たな道を歩むが良い`);
  }

  get 背景画像() { return "job_change.gif"; }
  get NPC() { return new キャラクター(this.サーバー, "@神官", "chr/016.gif"); }

  _はなす(プレイヤー) {
    super._はなす(
      "よくきた！このダーマ神殿ではお主の職業を変えることができるぞ",
      "ふむふむ。どの職業にしようかまよっているのじゃな",
      "転職をすると今のステータスが半分になってしまうぞ",
      "職業は重要じゃからよーく考えるのじゃよ",
      "転職アイテムを持っていれば、特別な職業に転職することができるぞ",
      `${プレイヤー.名前}は男前だから剣士なんかどうじゃろ？`,
      `${プレイヤー.名前}はお金が欲しいと思っているな？それなら商人になりなさい`,
      `${プレイヤー.名前}はモンスターと仲良くなりたいと思っているな？それなら魔物使いになりなさい`,
      `${プレイヤー.名前}は癒し系になりたいと思っているな？それなら僧侶になりなさい`,
      `${プレイヤー.名前}は相手やお宝が気になっているな？それなら盗賊になりなさい`,
      `${プレイヤー.名前}は誰かにイタズラしたいと思っているな？それなら遊び人になりなさい`,
      `${プレイヤー.名前}はモコモコしたものが好きじゃな？それなら羊飼いになりなさい`,
      `${プレイヤー.名前}は最終的に${転職可能な職業.ランダム取得().名前}を目指すと良いじゃろぉ`,
      `${プレイヤー.名前}に一番しっくりくるのは${転職可能な職業.ランダム取得().名前}じゃな`,
      "転職条件が厳しいからといって強いとは限らんぞ",
      "どんなにスキルを覚えても使いこなせなきゃ意味がないぞ",
      "スキルを早く覚えたい場合は早期転職をオススメしておる",
      "ステータスを上げたい場合は、成長率の高い職業を選び、なるべく遅く転職するのがコツじゃ",
      "今の職業のスキルを全てマスターしてから転職しても、おそくはないはずじゃ",
      `${プレイヤー.名前}の今の転職回数は…${プレイヤー.転職回数}回。ふむ、なかなかじゃのぉ`,
      "転職回数は冒険者の熟練度でもある。３回転職をすると初心者卒業レベルかのぉ",
      "転職回数は冒険者の熟練度でもある。10回以上の転職者は、この世界を熟知しているベテランじゃのぉ"
    );
  }

  /**
   * @param {プレイヤー} プレイヤー
   */
  ヘッダー出力(プレイヤー) {
    const 断片 = document.createDocumentFragment();
    断片.append(
      super._ヘッダー用出力(),
      強調テキスト(`${プレイヤー.現職.名前} SP `, プレイヤー.現職.SP)
    );
    if (プレイヤー.前職 !== undefined) {
      断片.appendChild(強調テキスト(` / ${プレイヤー.前職.名前} SP `, プレイヤー.前職.SP));
    }
    断片.append(
      強調テキスト(" / Lv. ", プレイヤー.レベル),
      プレイヤー.ステータス.ヘッダー用基礎値出力()
    );
    const 道具 = プレイヤー.装備.道具;
    if (道具.装備中) {
      断片.appendChild(document.createTextNode(` / E：${道具.装備.名前}`));
    }
    return 断片;
  }

  /**
   * @param {プレイヤー} プレイヤー
   */
  _NPCをしらべる(プレイヤー) {
    super._NPCをしらべる(プレイヤー.実績.簡易出力());
  }

  static get コマンド() { return this.#コマンド ?? this.#コマンドを登録(); }

  static #コマンドを登録() {
    this.#コマンド = new PlaceCommandGroup("temple", "ダーマ神殿");
    this.#コマンド.追加(
      new PlaceActionCommand("job-change", this.prototype.てんしょく)
        .引数追加("STRING", "job", "しょくぎょう", false)
    );
    return this.#コマンド;
  }

  /**
   * @type {PlaceCommandGroup}
   */
  static #コマンド;
}
