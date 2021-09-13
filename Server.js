"use strict";

import {
  Guild,
  TextBasedChannel,
  TextChannel,
  ThreadChannel
} from "discord.js";
import { 職業ランキング } from "./logger/JobRanking"
import { 殿堂 } from "./logger/HollOfFame"
import { チャレンジ記録 } from "./logger/ChallengeRecord"
import { ログ書き込み君 } from "./logger/Logger"

const スレッド名 = {
  職業ランキング: "職業ランキング",
};

/**
 * @typedef {Object} サーバーチャンネル
 * @property {TextChannel} ニュース
 * @property {TextChannel} フォトコン
 * @property {TextChannel} プレイヤー一覧
 * @property {TextChannel} チャレンジ記録
 * @property {TextChannel} ランキング
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
    this.#ニュース = new ログ書き込み君(サーバーチャンネル.ニュース);
    this.#フォトコン = 0; // TODO
    this.#プレイヤー一覧 = 0; // TODO
    this.#ギルド勢力 = 0; // TODO
    this.#チャレンジ記録 = new チャレンジ記録(サーバーチャンネル.チャレンジ記録);
    this.#プレイヤーランキング = 0;  // TODO
    this.#殿堂 = new 殿堂(サーバーチャンネル.殿堂);
    this.#職業ランキング = new 職業ランキング(サーバーチャンネル.職業ランキング);
  }

  get ニュース() { return this.#ニュース; }
  get フォトコン() { return this.#フォトコン }
  get プレイヤー一覧() { return this.#プレイヤー一覧 }
  get ギルド勢力() { return this.#ギルド勢力 }
  get チャレンジ記録() { return this.#チャレンジ記録; }
  get プレイヤーランキング() { return this.#プレイヤーランキング }
  get 殿堂() { return this.#殿堂 }
  get 職業ランキング() { return this.#職業ランキング; }

  static チャンネルを取得または作成する(guild) {

  }

  #ニュース;
  #フォトコン;
  #プレイヤー一覧;
  #ギルド勢力;
  #チャレンジ記録;
  #プレイヤーランキング;
  #殿堂;
  #職業ランキング;

}