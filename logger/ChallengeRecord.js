// @ts-check
"use strict";

import { MessageEmbed } from "discord.js"
import { メンバー } from "../character/Character.js"
import { 戦闘メンバー } from "../battle/BattleMember.js"
import { ログ書き込み君 } from "./Logger.js"

/**
 * @typedef {import("../battle/Quest.js").クエスト} クエスト
 */
export class プレイヤーランキング extends ログ書き込み君 {
  /**
   * 
   * @param {Array<メンバー>} 戦闘メンバーリスト 
   * @param {クエスト} クエスト
   */
  async 更新(戦闘メンバーリスト , クエスト) {
    // TODO
  }

  /**
   * 
   * @param {戦闘メンバー} 戦闘メンバー 
   * @returns {MessageEmbed}
   */
  // TODO メンバーを戦闘メンバーから持ってくるかどうか
  #メンバーをembedへ(順位, 戦闘メンバー) {
    const
      ステータス = 戦闘メンバー.ステータス,
      メンバー = 戦闘メンバー.メンバー;
    return new MessageEmbed({
      title: `${戦闘メンバー.名前}＠${メンバー.ギルド.名前}`,
      color: メンバー.色,
      fields: [
        {
          name: "現職",
          value: 戦闘メンバー.現職.名前
        },
        {
          name: "前職",
          value: 戦闘メンバー.前職.名前
        },
        {
          name: "ＨＰ",
          value: ステータス.ＨＰ
        },
        {
          name: "ＭＰ",
          value: ステータス.ＭＰ
        },
        {
          name: "攻撃力",
          value: ステータス.攻撃力
        },
        {
          name: "守備力",
          value: ステータス.守備力
        },
        {
          name: "素早さ",
          value: ステータス.素早さ
        }
      ],
      image: 戦闘メンバー.アイコン
    });
  }
}