// @ts-check
"use strict";

import { MessageEmbed } from "discord.js"
import { ログ書き込み君 } from "./Logger.js"
import { 性別 } from "../Symbol.js"

export class 職業ランキング extends ログ書き込み君 {
  async 職業ランキングを取得() {
    this.データ
  }

  /**
   * @param {string} 職業 職業名
   * @param {Symbol} _性別
   */
  データ追加(職業, _性別) {
    switch (_性別) {
      case 性別.男:

      case 性別.女:

      default:
        throw "不明な性別です";
    }
  }

  /**
   * 
   * @param {string} 職業名
   * @param {number} 順位
   * @param {string} 画像 職業画像のURL
   * @param {number} 男回数 その職業に男として転職した延べ人数
   * @param {number} 女回数 その職業に女として転職した延べ人数
   * @returns {MessageEmbed} embed
   */
   getEmbed(職業名, 順位, 画像, 男回数, 女回数) {
    return new MessageEmbed({
      title: 職業名,
      color: 色,
      fields: [
        {
          name: "順位",
          value: `**${順位}**位`
        },
        {
          name: "男",
          value: `${男回数}回(**${Math.round(男回数/(男回数+女回数))}**％)`
        },
        {
          name: "女",
          value: `${女回数}回(**${Math.round(女回数/(男回数+女回数))}**％)`
        }
      ],
      image: 画像
    })
  }

  #データ;
}