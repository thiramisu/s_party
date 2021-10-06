// @ts-check
"use strict";

/**
 * @typedef {import("../character/Member.js").メンバー} メンバー
 */

export class PlaceActionCommand {
  /**
   * 
   * @param {string} コマンド名 [a-z-]
   * @param {(メンバー: メンバー, ...引数: any[]) => void | boolean} 行動 名前が説明に使われる。効果が実行される。
   */
  constructor(コマンド名, 行動, 隠しコマンドか = false) {
    this.#コマンド名 = コマンド名;
    this.#行動 = 行動;
    this.#引数 = [];
    this.#隠しコマンドか = 隠しコマンドか;
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
   * @param {Map<string, string|number>} [候補] 日本語名 => 英語名。タイプが`"NUMBER"`,`"STRING"`,`"INTEGER"`の時のみ。
   * @returns {this} this
   */
  引数追加(タイプ, 英語名, 日本語名, 必須か, 候補) {
    this.#引数.push({
      type: タイプ,
      name: 英語名,
      description: 日本語名,
      required: 必須か,
      choices: 候補 === undefined ? undefined : Array.from(候補).map(this.#選択肢へ)
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

  get 隠しコマンドか() { return this.#隠しコマンドか }

  /**
   * 
   * @param {[string, string|number]} param0 
   * @returns {import("discord.js").ApplicationCommandOptionChoice}
   */
  #選択肢へ([日本語名, 英語名]) {
    return {
      name: 日本語名,
      value: 英語名
    };
  }

  #コマンド名;
  #行動;
  #隠しコマンドか;
  /**
   * @type {(import("discord.js").ApplicationCommandChoicesData
   * | import("discord.js").ApplicationCommandNonOptionsData)[]}
   */
  #引数;
}
