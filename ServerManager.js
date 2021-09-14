"use strict";

import { サーバー } from "./Server.js"

/**
 * @typedef {import("discord.js").Guild} Guild
 * @typedef {import("discord.js").Snowflake} Snowflake
 */

export class ServerManager {
  constructor() {
    this.#初期化済みサーバーリスト = new Set();
  }

  /**
   * 
   * @param {Guild} _サーバー 
   */
  async 取得(_サーバー) {
    const
      サーバーリスト = this.#初期化済みサーバーリスト,
      id = _サーバー.id;
    if (サーバーリスト.has(id)) {
      return サーバーリスト.get(id);
    }
    // discord.jsのcacheの仕様が不明
    // await _サーバー.channels.fetch();
    const
      チャンネルリスト = await サーバー.全テキストチャンネルを取得または作成する(_サーバー.channels),
      新サーバー = new サーバー(_サーバー, チャンネルリスト);
    サーバーリスト.add(id, 新サーバー);
    return 新サーバー;
  }

  /**
   * 初期化済みサーバーの`Snowflake`一覧
   * @type {Map<Snowflake, サーバー>}
   */
  #初期化済みサーバーリスト;
}