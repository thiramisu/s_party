// @ts-check
"use strict";

import { Guild, ThreadChannel } from "discord.js";
import { プレイヤーマネージャー } from "./character/PlayerManager.js"
import { ギルドマネージャー } from "./GuildManager.js"
import { 職業ランキング } from "./logger/JobRanking.js"
import { 殿堂 } from "./logger/HallOfFame.js"
import { チャレンジ記録 } from "./logger/ChallengeRecord.js"
import { プレイヤー一覧 } from "./logger/PlayerList.js"
import { ログ書き込み君 } from "./logger/Logger.js"

import { 冒険に出る } from "./place/Quest.js";
import { カジノ } from "./place/Casino.js";
import { 預かり所 } from "./place/Depot.js";
import { 武器屋 } from "./place/WeaponShop.js";
import { 防具屋 } from "./place/ArmorShop.js";
import { 道具屋 } from "./place/ItemShop.js";
import { 秘密の店 } from "./place/SecretShop.js";
import { ルイーダの酒場 } from "./place/Bar.js";
import { 福引所 } from "./place/Lot.js";
import { モンスターじいさん } from "./place/MonsterDepot.js";
import { フォトコン会場 } from "./place/PhotoContest.js";
import { オラクル屋 } from "./place/Oracle.js";
import { 闇市場 } from "./place/BlackMarket.js";
import { メダル王の城 } from "./place/MedalCastle.js";
import { ダーマ神殿 } from "./place/Temple.js";
import { 交流広場 } from "./place/Park.js";
import { オークション会場 } from "./place/Auction.js";
import { イベント広場 } from "./place/EventPark.js";
import { 願いの泉 } from "./place/Spring.js";
import { 復活の祭壇 } from "./place/Altar.js";
import { ギルド協会 } from "./place/GuildAssociation.js";
import { 命名の館 } from "./place/NamingMansion.js";
import { 追放騎士団 } from "./place/ExileKnights.js";
import { 何でも屋 } from "./place/Helper.js";
import { 錬金場 } from "./place/Alchemy.js";
import { 天界 } from "./place/Heaven.js";

/**
 * @typedef {import("discord.js").CategoryChannel} CategoryChannel
 * @typedef {import("discord.js").GuildChannel} GuildChannel
 * @typedef {import("discord.js").GuildChannelManager} GuildChannelManager
 * @typedef {import("discord.js").Snowflake} Snowflake
 * @typedef {import("discord.js").TextChannel} TextChannel
 * 
 * @typedef {import("./place/Place.js").場所} 場所
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
  職業ランキング: "職業ランキング"
});

/**
 * @type {typeof import("./place/Place.js").場所[]}
 */
const 移動場所リスト = [
  冒険に出る,
  カジノ,
  預かり所,
  武器屋,
  防具屋,
  道具屋,
  秘密の店,
  ルイーダの酒場,
  福引所,
  モンスターじいさん,
  フォトコン会場,
  オラクル屋,
  闇市場,
  メダル王の城,
  ダーマ神殿,
  交流広場,
  オークション会場,
  イベント広場,
  願いの泉,
  復活の祭壇,
  ギルド協会,
  命名の館,
  追放騎士団,
  何でも屋,
  錬金場,
  天界
]

for (const 移動場所 of 移動場所リスト) {
  console.log(移動場所.name);
  Object.defineProperty(チャンネル名, 移動場所.name, 移動場所.name);
}

/**
 * @typedef {Map<チャンネル名, GuildChannel>} サーバーチャンネル チャンネル名とチャンネルの対応
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
    this.#guild = guild;
    this.#プレイヤーマネージャー = new プレイヤーマネージャー(this);
    this.#ギルドマネージャー = new ギルドマネージャー(this);

    this.#ニュース = new ログ書き込み君(this, /** @type {TextChannel} */(サーバーチャンネル.get(チャンネル名.ニュース)));
    this.#フォトコン = 0; // TODO
    this.#プレイヤー一覧 = new プレイヤー一覧(this,  /** @type {TextChannel} */(サーバーチャンネル.get(チャンネル名.プレイヤー一覧)));
    this.#ギルド勢力 = 0; // TODO
    this.#チャレンジ記録 = new チャレンジ記録(this, /** @type {TextChannel} */(サーバーチャンネル.get(チャンネル名.チャレンジ記録)));
    this.#プレイヤーランキング = 0;  // TODO
    this.#殿堂 = new 殿堂(this, /** @type {TextChannel} */(サーバーチャンネル.get(チャンネル名.殿堂)));
    this.#職業ランキング = new 職業ランキング(this, /** @type {TextChannel} */(サーバーチャンネル.get(チャンネル名.職業ランキング)));
    for (const 場所 of 移動場所リスト) {
      const 場所名 = 場所.name;
      Object.defineProperty(this, 場所名, new 場所(this,  /** @type {TextChannel} */(サーバーチャンネル.get(場所名))))
    }
  }

  get guild() { return this.#guild; }

  get プレイヤー() { return this.#プレイヤーマネージャー }
  get ギルド() { return this.#ギルドマネージャー; }

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
   * @returns {Promise<Map<チャンネル名, GuildChannel>>}
   */
  static async 全テキストチャンネルを取得または作成する(チャンネルマネージャー) {
    const
      名前候補 = new Set(Object.values(チャンネル名)),
      /**
       * @type {Map<チャンネル名, GuildChannel>}
       */
      結果 = new Map();
    const メインカテゴリー = await this.#メインカテゴリーを取得または作成する(チャンネルマネージャー);
    結果.set(チャンネル名.メインカテゴリー, メインカテゴリー);
    名前候補.delete(チャンネル名.メインカテゴリー);
    for (const チャンネル of メインカテゴリー.children.values()) {
      const チャンネルの名前 = チャンネル.name;
      if (!名前候補.has(チャンネルの名前) || チャンネル.type !== "GUILD_TEXT") {
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
   * @returns {Promise<CategoryChannel>}
   */
  static async #メインカテゴリーを取得または作成する(チャンネルマネージャー) {
    return /** @type {CategoryChannel} */(チャンネルマネージャー.cache.find(this.#メインカテゴリーか))
      ?? (await チャンネルマネージャー.create(チャンネル名.メインカテゴリー, {
        type: "GUILD_CATEGORY"
      }));
  }

  /**
   * 
   * @param {GuildChannel | ThreadChannel} チャンネル 
   * @returns {boolean}
   */
  static #メインカテゴリーか(チャンネル) {
    return チャンネル.name === チャンネル名.メインカテゴリー && チャンネル.type === "GUILD_CATEGORY";
  }

  /**
   * @type {import("discord.js").Guild}
   */
  #guild;
  #プレイヤーマネージャー;
  #ギルドマネージャー;
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