// @ts-check
"use strict";

import {
  MessageEmbed,
  TextChannel
} from "discord.js"
import { ログ書き込み君 } from "./Logger.js"
import { メンバー } from "../character/Character.js"
import { 記録スレッドマネージャー } from "../logger/RecordThreadManager.js"

/**
 * @readonly
 * @enum {string}
 */
export const 殿堂の名前 = {
  職業: "ジョブマスター",
  魔物: "モンスターマスター",
  武器: "ウェポンキラー",
  防具: "アーマーキング",
  道具: "アイテムニスト",
  錬金: "アルケミスト"
};

export class 殿堂 extends 記録スレッドマネージャー {
  /**
   * 
   * @param {TextChannel} チャンネル 
   */
  constructor(チャンネル) {
    super(チャンネル, Object.values(殿堂の名前), 殿堂スレッド);
  }
}

class 殿堂スレッド extends ログ書き込み君 {
  /**
   * 
   * @param {メンバー} プレイヤー 
   */
  async プレイヤー追加(プレイヤー) {
    await super.全て書き込む([
      new MessageEmbed({
        title: `${プレイヤー.名前}＠${プレイヤー.ギルド.名前}`,
        color: プレイヤー.色,
        fields: [
          {
            name: "記念日",
            value: `0000/00/00`
          }
        ],
        image: {
          url: プレイヤー.アイコン
        }
      })
    ]);
  }
}