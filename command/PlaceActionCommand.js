// @ts-check
"use strict";

import { メンバー } from "../character/Character.js"

export class PlaceActionCommand {
  /**
   * 
   * @param {string} コマンド名 [a-z-]
   * @param {(メンバー: メンバー, ...引数: any[]) => void | boolean} 行動 名前が説明に使われる。効果が実行される。
   */
  constructor(コマンド名, 行動) {
    this.#コマンド名 = コマンド名;
    this.#行動 = 行動;
    this.#引数 = [];
  }

  /**
   * @param {import("discord.js").CommandInteraction} interaction
   * @param {メンバー} メンバー
   */
  実行(interaction, メンバー) {
    this.#行動.apply(メンバー.現在地, this.#引数.map(({ name }) => interaction.options.get(name)));
  }

  /**
   * 
   * @param {Exclude<
   *   import("discord.js").CommandOptionDataTypeResolvable,
   *   import("discord.js").CommandOptionSubOptionResolvableType
   * >} タイプ
   * @param {string} 英語名
   * @param {string} 日本語名
   * @param {boolean} 必須か
   * @param {Map<string, string>} [候補] 日本語名 => 英語名。タイプが`"NUMBER"`,`"STRING"`,`"INTEGER"`の時のみ。
   * @returns {PlaceActionCommand} this
   */
  引数追加(タイプ, 英語名, 日本語名, 必須か, 候補) {
    this.#引数.push({
      type: タイプ,
      name: 英語名,
      description: 日本語名,
      required: 必須か,
      choices: Array.from(候補).map(this.#選択肢へ)
    });
    return this;
  }

  /**
   * 
   * @returns {import("discord.js").ApplicationCommandSubCommandData}
   */
  オプションへ() {
    return {
      type: "SUB_COMMAND",
      name: this.#コマンド名,
      description: "/" + this.#行動.name,
      options: this.#引数
    };
  }

  /**
   * 
   * @param {[string, string]} param0 
   * @returns {import("discord.js").ApplicationCommandOptionChoice}
   */
  #選択肢へ([日本語名, 英語名]) {
    return {
      name: 英語名,
      value: 日本語名
    };
  }

  #コマンド名;
  #行動;
  /**
   * @type {(import("discord.js").ApplicationCommandChoicesData
   * | import("discord.js").ApplicationCommandNonOptionsData)[]}
   */
  #引数;
}
