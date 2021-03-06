// @ts-check
"use strict";

import { 場所 } from "./Place.js"
import { 専門店 } from "./Shop.js"
import { キャラクター } from "../character/Character.js"
import { アイテム, 武器 } from "../item/Item.js"
import { ランダムな1要素 } from "../Util.js";
import { PlaceActionCommand } from "../command/PlaceActionCommand.js";
import { PlaceCommandGroup } from "../command/PlaceCommandGroup.js";

/**
 * @typedef {import("../character/Member.js").メンバー} プレイヤー
 */

export class 武器屋 extends 専門店 {
  constructor() {
    super("weapon.gif", 場所._訪問方法.いどう, new キャラクター("@ﾌﾞｯｷｰ", "chr/005.gif"),
      武器, 2, "何を買うんだい？", "お金が足りないみたいだぜ");
  }

  /**
   * 
   * @param {プレイヤー} プレイヤー 
   */
  _はなす(プレイヤー) {
    super._はなす(
      "ここは武器屋だ！戦いに武器は必須だぜ！",
      `${プレイヤー.名前}には${ランダムな1要素(this._品揃えアイテム名リストを取得(プレイヤー.転職回数))}なんか良いんじゃねぇか？`,
      `${プレイヤー.名前}には${ランダムな1要素(this._品揃えアイテム名リストを取得(プレイヤー.転職回数))}がオススメだ！`,
      "銅の剣はどぉの剣？",
      "よぉ！何か買っていくのか？",
      "素早さが高いと会心の一撃や回避率が上がるぞ！",
      "攻撃力が高い分、重さも重くなり素早さが下がる。つまり、自分に合った装備をしろってことだ！",
      "この世界のどこかに、自分の強さにより武器の強さも変わる武器があるらしいぜ！",
      "モンスターにやられたとしてもお金が半分になることはないぜ！",
      `${プレイヤー.名前}の攻撃力は${プレイヤー.ステータス.攻撃力} か…。Lv.${プレイヤー.レベル} にしてはなかなかだな！`,
      `${プレイヤー.名前}の転職回数は${プレイヤー.転職回数}回か！転職回数が多ければ熟練者と見なし、もっと強い武器を売ってやるぜ！`
    );
  }

  _NPCをしらべる() {
    super._NPCをしらべる(`${this._NPC.名前}「おいおい、俺は武器じゃねぇぜ」`);
  }

  /**
   * @param {プレイヤー} プレイヤー
   * @param {string} 対象
   */
  うる(プレイヤー, 対象) {
    super._うる(プレイヤー, 対象, プレイヤー.装備.武器);
  }

  /**
   * 
   * @param {プレイヤー} プレイヤー 
   */
  _うるクリック時(プレイヤー) {
    super._うるクリック時(プレイヤー.装備.武器, `売るって何を売る気だ？${プレイヤー.名前}は武器を持っていないようだが`)
  }

  /**
   * @param {number} 転職回数
   */
  _品揃えアイテム名リストを取得(転職回数) {
    const 品揃え = [...アイテム.名前範囲("ひのきの棒", "いばらのむち"), "ﾀﾞｶﾞｰﾅｲﾌ"];
    // デフォルトに忠実
    if (転職回数 <= 11) {
      品揃え.push(アイテム.IDから(6 + 転職回数).名前);
    }
    else {
      品揃え.push(...アイテム.名前範囲("ﾌﾞﾛﾝｽﾞﾅｲﾌ", "ﾁｪｰﾝｸﾛｽ"));
    }
    return 品揃え;
  }

  _装備時の会話内容を取得(プレイヤー, アイテム) { return `まいど！${アイテム.名前}だ！受けとってくれ！`; }
  _倉庫送信時の会話内容を取得(プレイヤー, アイテム) { return `まいど！${アイテム.名前}は${プレイヤー.名前}の預かり所に送っておいたぜ！`; }
  _売却確認時の通知内容を取得(プレイヤー, アイテム名, 売却価格) { return `${アイテム名}なら ${売却価格} Gで買い取るぜ！`; }
  _売却時の会話内容を取得(プレイヤー, アイテム名, 売却価格) { return `${アイテム名} の買取代の ${売却価格} Gだ！`; }

  static get コマンド() { return this.#コマンド ?? this.#コマンドを登録(); }

  static #コマンドを登録() {
    this.#コマンド = new PlaceCommandGroup("weapon-shop", "武器屋");
    this.#コマンド.追加(
      new PlaceActionCommand("buy", this.prototype._かう)
        .引数追加("STRING", "weapon", "武器", false),
      new PlaceActionCommand("sell", this.prototype.うる)
    );
    return this.#コマンド;
  }

  /**
   * @type {PlaceCommandGroup}
   */
  static #コマンド;
}
