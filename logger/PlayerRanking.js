"use strict";

import { MessageEmbed } from "discord.js"
import { メンバー } from "../character/Character"
import { ログ書き込み君 } from "./Logger"

export class プレイヤーランキング extends ログ書き込み君 {
  /**
   * 
   * @param {Array<メンバー>} 戦闘メンバーリスト 
   * @param {クエスト} クエスト
   */
  async 更新(プレイヤーリスト) {
    // TODO
  }

  /**
   * 
   * @param {戦闘メンバー} 戦闘メンバー 
   * @returns {MessageEmbed}
   */
  #メンバーをembedへ(順位, 戦闘メンバー) {
    const ステータス = 戦闘メンバー.ステータス;
    return new MessageEmbed({
      title: `${戦闘メンバー.名前}＠${戦闘メンバー.ギルド.名前}`,
      color: 戦闘メンバー.色,
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
      image: 戦闘メンバー.画像
    });
  }
}