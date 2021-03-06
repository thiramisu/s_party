// @ts-check
"use strict";

import { MessageEmbed } from "discord.js"
import { 基底 } from "../Base.js"
import { 色名 } from "../config.js";

/**
 * @typedef {import("../Server.js").サーバー} サーバー
 * @typedef {import("discord.js").ColorResolvable} ColorResolvable
 * @typedef {import("discord.js").TextBasedChannels} TextBasedChannels
 */

/**
 * discord の API で1メッセージあたりに含められるEmbedの最大数
 */
const MAX_EMBED_COUNT_PER_MESSAGE = 10;

export class ログ書き込み君 extends 基底 {
  /**
   * 
   * @param {サーバー} サーバー
   * @param {TextBasedChannels} チャンネル 
   */
  constructor(サーバー, チャンネル) {
    super(サーバー);
    this.#チャンネル = チャンネル;
  }

  /**
   * embedsの最大数ごとに自動分割した上ですべての内容を書き込みます。
   * @param {Array<MessageEmbed>} embeds
   * @param {string} [見出し] 最初にembedsの外に表示する内容
   */
  async 全て書き込む(embeds, 見出し) {
    const iMax = embeds.length;
    for (let i = 0; i < iMax; i += MAX_EMBED_COUNT_PER_MESSAGE) {
      await this.#送信する(embeds.slice(i, i + MAX_EMBED_COUNT_PER_MESSAGE), i === 0 ? 見出し : undefined);
    }
  }

  /**
   * 
   * @param {string} 内容 
   * @param {ColorResolvable} 色 
   */
  async 書き込む(内容, 色 = 色名.デフォルト) {
    await this.#チャンネル.send({
      embeds: [
        new MessageEmbed({
          title: 内容,
          color: 色
        })
      ]
    }
    );
  }

  get チャンネル() { return this.#チャンネル }

  /**
   * @param {Array<MessageEmbed>} embeds 
   * @param {string} ヘッダー ヘッダー情報不要なら`undefined`
   */
  async #送信する(embeds, ヘッダー) {
    await this.#チャンネル.send({
      content: ヘッダー,
      embeds
    });
  }

  #チャンネル;
}
