"use strict";

import { Guild } from "discord.js";
import { 職業ランキング } from "./logger/JobRanking.js"
import { 殿堂 } from "./logger/HallOfFame.js"
import { チャレンジ記録 } from "./logger/ChallengeRecord.js"
import { ログ書き込み君 } from "./logger/Logger.js"

/**
 * @typedef {import("discord.js").CategoryChannel} CategoryChannel
 * @typedef {import("discord.js").GuildChannel} GuildChannel
 * @typedef {import("discord.js").GuildChannelManager} GuildChannelManager
 * @typedef {import("discord.js").Snowflake} Snowflake
 * @typedef {import("discord.js").TextChannel} TextChannel
 */

/**
 * 使用するチャンネル名の定義。
 * 名前被り不可。
 * テキストチャンネル名は、半角記号・半角英大文字が使用不可で100文字以内っぽい
 * (大文字は小文字に変換されるが表示上は小文字も大文字になる)
 * @readonly
 * @enum {string}
 */
export const チャンネル名 = Object.freeze({
  /**
   * 占有するカテゴリーチャンネルの名前。
   * 英小文字は大文字として表示される模様。
   * 記号使用可能
   */
  メインカテゴリー: "/パーティー",
  ニュース: "ニュース",
  フォトコン: "フォトコン",
  プレイヤー一覧: "ﾌﾟﾚｲﾔｰ一覧",
  ギルド一覧: "ギルド勢力",
  チャレンジ記録: "世界記録",
  プレイヤーランキング: "ランキング",
  殿堂: "伝説のﾌﾟﾚｲﾔｰ",
  職業ランキング: "職業ランキング",
});

/**
 * @typedef {Object} サーバーチャンネル
 * @property {CategoryChannel} メインカテゴリー
 * @property {TextChannel} ニュース
 * @property {TextChannel} フォトコン
 * @property {TextChannel} プレイヤー一覧
 * @property {TextChannel} ギルド一覧
 * @property {TextChannel} チャレンジ記録
 * @property {TextChannel} プレイヤーランキング
 * @property {TextChannel} 殿堂
 * @property {TextChannel} 職業ランキング
 */

export class サーバー {
  /**
   * 
   * @param {Guild} guild 
   * @param {サーバーチャンネル} サーバーチャンネル 
   */
  constructor(guild, サーバーチャンネル) {
    this.guild = guild;

    this.#ニュース = new ログ書き込み君(サーバーチャンネル.get(チャンネル名.ニュース));
    this.#フォトコン = 0; // TODO
    this.#プレイヤー一覧 = 0; // TODO
    this.#ギルド勢力 = 0; // TODO
    this.#チャレンジ記録 = new チャレンジ記録(サーバーチャンネル.get(チャンネル名.チャレンジ記録));
    this.#プレイヤーランキング = 0;  // TODO
    this.#殿堂 = new 殿堂(サーバーチャンネル.get(チャンネル名.殿堂));
    this.#職業ランキング = new 職業ランキング(サーバーチャンネル.get(チャンネル名.職業ランキング));
  }

  get ニュース() { return this.#ニュース; }
  get フォトコン() { return this.#フォトコン; }
  get プレイヤー一覧() { return this.#プレイヤー一覧; }
  get ギルド勢力() { return this.#ギルド勢力; }
  get チャレンジ記録() { return this.#チャレンジ記録; }
  get プレイヤーランキング() { return this.#プレイヤーランキング; }
  get 殿堂() { return this.#殿堂; }
  get 職業ランキング() { return this.#職業ランキング; }

  /**
   * 
   * @param {GuildChannelManager} チャンネルマネージャー
   * @returns {Promise<Map<チャンネル名, TextChannel>>}
   */
  static async 全テキストチャンネルを取得または作成する(チャンネルマネージャー) {
    const
      名前候補 = new Set(Object.values(チャンネル名)),
      /**
       * @type {Map<チャンネル名, TextChannel>}
       */
      結果 = new Map();
    const メインカテゴリー = await this.#メインカテゴリーを取得または作成する(チャンネルマネージャー);
    結果.set(チャンネル名.メインカテゴリー, メインカテゴリー);
    名前候補.delete(チャンネル名.メインカテゴリー);
    for (const チャンネル of チャンネルマネージャー.cache.values()) {
      const チャンネルの名前 = チャンネル.name;
      if (!名前候補.has(チャンネルの名前) || チャンネル.parent !== メインカテゴリー || チャンネル.type !== "GUILD_TEXT") {
        continue;
      }
      結果.set(チャンネルの名前, チャンネル);
      名前候補.delete(チャンネルの名前);
    }
    // 見つからなかった場合チャンネルを作成
    for (const チャンネルの名前 of 名前候補) {
      結果.set(チャンネルの名前, await チャンネルマネージャー.create(チャンネルの名前, {
        type: "GUILD_TEXT",
        parent: メインカテゴリー
      }));
    }
    return 結果;
  }

  /**
   * 
   * @param {GuildChannelManager} チャンネルマネージャー
   * @returns {Promise<CategoryChannel}
   */
  static async #メインカテゴリーを取得または作成する(チャンネルマネージャー) {
    return チャンネルマネージャー.cache.find(this.#メインカテゴリーか)
      ?? (await チャンネルマネージャー.create(チャンネル名.メインカテゴリー, {
        type: "GUILD_CATEGORY"
      }));
  }

  /**
   * 
   * @param {GuildChannel} チャンネル 
   * @returns {boolean}
   */
  static #メインカテゴリーか(チャンネル) {
    return チャンネル.name === チャンネル名.メインカテゴリー && チャンネル.type === "GUILD_CATEGORY";
  }

  #コマンドマネージャー;
  #ニュース;
  #フォトコン;
  #プレイヤー一覧;
  #ギルド勢力;
  #チャレンジ記録;
  #プレイヤーランキング;
  #殿堂;
  #職業ランキング;
}