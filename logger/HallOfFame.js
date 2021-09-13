"use strict";

import {
  MessageEmbed,
  TextChannel,
  ThreadChannel
} from "discord.js"
import { ログ書き込み君 } from "./Logger.js"
import { メンバー } from "../character/Character.js"
import { 全名前からスレッドを取得または作成 } from "../Util"

/**
 * @type {Object}
 */
const スレッド名 = {
  職業: "ジョブマスター",
  魔物: "モンスターマスター",
  武器: "ウェポンキラー",
  防具: "アーマーキング",
  道具: "アイテムニスト",
  錬金: "アルケミスト"
};

export class 殿堂 {
  /**
   * 
   * @param {TextChannel} チャンネル 
   */
  constructor(チャンネル) {
    this.#チャンネル = チャンネル;
    /**
     * @type {Map<string, 殿堂スレッド>}
     */
    this.#スレッドリスト = new Map();
  }

  async get 職業() { if (this.#スレッドリスト === undefined) { this.#fetch(); } return this.#スレッドリスト.get(スレッド名.職業); }
  async get 魔物() { if (this.#スレッドリスト === undefined) { this.#fetch(); } return this.#スレッドリスト.get(スレッド名.魔物); }
  async get 武器() { if (this.#スレッドリスト === undefined) { this.#fetch(); } return this.#スレッドリスト.get(スレッド名.武器); }
  async get 防具() { if (this.#スレッドリスト === undefined) { this.#fetch(); } return this.#スレッドリスト.get(スレッド名.防具); }
  async get 道具() { if (this.#スレッドリスト === undefined) { this.#fetch(); } return this.#スレッドリスト.get(スレッド名.道具); }
  async get 錬金() { if (this.#スレッドリスト === undefined) { this.#fetch(); } return this.#スレッドリスト.get(スレッド名.錬金); }

  /**
   * スレッドをオンラインで取得
   */
  async #fetch() {
    全名前からスレッドを取得または作成(await this.#チャンネル.threads.fetch(), スレッド名.values()).forEach(this.#スレッドリストに追加, this);
  }

  /**
   * 
   * @param {string} 名前 
   * @param {ThreadChannel} スレッド 
   */
  #スレッドリストに追加(名前, スレッド) {
    this.#スレッドリスト.set(名前, new 殿堂スレッド(スレッド));
  }

  #チャンネル;
  #スレッドリスト;
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
        color: 色,
        fields: [
          {
            name: "記念日",
            value: `0000/00/00`
          }
        ],
        image: プレイヤー.画像
      })
    ]);
  }
}