// @ts-check
"use strict";

import {
  MessageEmbed,
  TextChannel,
  ThreadChannel
} from "discord.js"

/**
 * @typedef {import("discord.js").ThreadManager} ThreadManager
 * @typedef {import("./Logger.js").ログ書き込み君} ログ書き込み君
 */

/**
 * @template {ログ書き込み君} T
 */
export class 記録スレッドマネージャー {
  /**
   * 
   * @param {TextChannel} チャンネル 
   * @param {Iterable<string>} スレッド名リスト
   * @param {import("discord.js").Constructable<T>} ログ書き込み君継承クラス
   */
  constructor(チャンネル, スレッド名リスト, ログ書き込み君継承クラス) {
    this.#チャンネル = チャンネル;
    this.#スレッド名リスト = スレッド名リスト;
    this.#スレッドリスト = new Map();
    this.#ログ書き込み君継承クラス = ログ書き込み君継承クラス;
  }

  /**
   * 
   * @param {string} 名前
   * @returns {Promise<T>}
   */
  async 取得(名前) {
    const スレッドリスト = this.#スレッドリスト;
    if (スレッドリスト.has(名前)) {
      return スレッドリスト.get(名前);
    }
    await this.#全名前からスレッドを取得または作成();
    console.log(this.#スレッドリスト.get(名前));
    return this.#スレッドリスト.get(名前);
  }

  async #全名前からスレッドを取得または作成() {
    const
      スレッドマネージャー = this.#チャンネル.threads,
      /**
       * @type {Set<string>}
       */
      名前候補 = new Set(this.#スレッド名リスト);
    await スレッドマネージャー.fetchArchived();
    await スレッドマネージャー.fetch();
    for (const スレッド of スレッドマネージャー.cache.values()) {
      const スレッド名 = スレッド.name;
      console.log(スレッド名);
      if (!名前候補.has(スレッド名)) {
        continue;
      }
      if (スレッド.archived) {
        await スレッド.setArchived(false);
      }
      this.#スレッドリストに追加(スレッド名, スレッド);
      名前候補.delete(スレッド名);
    }
    for (const 作成スレッド名 of 名前候補) {
      this.#スレッドリストに追加(
        作成スレッド名,
        await スレッドマネージャー.create({
          name: 作成スレッド名,
          autoArchiveDuration: 60
        })
      );
    }
  }

  /**
   * 
   * @param {string} 名前 
   * @param {ThreadChannel} スレッド 
   */
  #スレッドリストに追加(名前, スレッド) {
    this.#スレッドリスト.set(名前, new this.#ログ書き込み君継承クラス(スレッド));
  }

  #チャンネル;
  #スレッド名リスト;
  #ログ書き込み君継承クラス;
  /**
   * @type {Map<string, T>}
   */
  #スレッドリスト;
}