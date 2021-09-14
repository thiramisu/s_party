// @ts-check
"use strict";

import { MessageEmbed } from "discord.js"

/**
 * @typedef {import("discord.js").ColorResolvable} ColorResolvable
 * @typedef {import("discord.js").TextBasedChannels} TextBasedChannels
 */

/**
 * discord の API で1メッセージあたりに含められるEmbedの最大数
 */
const MAX_EMBED_COUNT_PER_MESSAGE = 10;

/**
 * 
 */
const DEFAULT_LOG_COLOR = "#FFFFFF";

export class ログ書き込み君 {
  /**
   * 
   * @param {TextBasedChannels} チャンネル 
   */
  constructor(チャンネル) {
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
  async 書き込む(内容, 色 = DEFAULT_LOG_COLOR) {
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
