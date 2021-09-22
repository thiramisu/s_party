// @ts-check
"use strict";

import { ApplicationCommand, Interaction, Message } from "discord.js"
import { MessageGetter } from "../MessageGetter.js"
import { 一般的な場所 } from "../place/General.js";
import { 預かり所 } from "../place/Depot.js";
import { 武器屋 } from "../place/WeaponShop.js";

/**
 * @typedef {import("discord.js").ThreadManager} ThreadManager
 * @typedef {import("discord.js").ThreadChannel} ThreadChannel
 * @typedef {import("discord.js").CommandInteraction} CommandInteraction
 * @typedef {import("discord.js").ApplicationCommandOptionData}  ApplicationCommandOptionData
 */

/**
 * 範囲内(または0~最大)の整数の乱数を返す
 * @param {number} max
 * @param {number} [min]
 * @param {Boolean} [isIncluded] 端を含めるか
 * @returns {Number}
 */
const integerRandom = (max, min = 0, isIncluded = false) =>
  Math.floor(Math.random() * (max - min + (isIncluded ? 1 : 0))) + min

/**
 * 名前からスレッド取得、無ければ作成
 * @param {ThreadManager} threads
 * @param {String} name
 * @param {String} [reason]
 * @returns {Promise<ThreadChannel>}
 */
const getOrCreateThreadByName = async (threads, name, reason) => {
  for (const thread of (await threads.fetchArchived()).threads.values()) {
    if (thread.name === name) {
      await thread.setArchived(false);
      return thread;
    }
  }
  for (const thread of (await threads.fetch()).threads.values()) {
    console.log("1" + thread.name);
    if (thread.name === name) {
      return thread;
    }
  }
  const thread = await threads.create({
    name: name,
    autoArchiveDuration: 60,
    reason: reason
  })
  return thread;
}

const commands = [
  {
    name: 'party',
    description: 'humu',
    exec: async interaction => {
      const options = interaction.options;
      switch (options.getSubcommand(true)) {
        case 'new-entry':
          const channel = interaction.channel;
          interaction.reply(
            MessageGetter.newEntry(
              interaction.member.displayName,
              options.getString('sex'),
              options.getString('job'),
              integerRandom(32, 30, true),
              integerRandom(8, 6, true),
              integerRandom(8, 6, true),
              integerRandom(8, 6, true),
              integerRandom(8, 6, true),
            ),
          );
          const thread = await getOrCreateThreadByName(
            // スレッド内でコマンドが使われた時はchannel.threadsが使えないので
            channel.threads ?? channel.parent.threads,
            'food-talk',
            'テスト',
          );
          await thread.members.add(interaction.member);
          await thread.send("チュートリアル予定地");
          break;
        case 'wiki':
          interaction.reply('http://www19.atwiki.jp/atparty2/');
          break;
        default:
          interaction.reply('未実装！！！')
      }
    },
    options: [
      {
        type: 'SUB_COMMAND',
        name: 'new-entry',
        japanese: '/新規登録',
        description: '/新規登録 - 説明書の初心者ﾌﾟﾚｲﾁｬｰﾄ必読',
        options: [
          {
            type: 'STRING',
            name: 'job',
            japanese: '職業',
            description: '職業',
            required: true,
            choices: [
              {
                name: '戦士',
                value: 'hogehoge',
              },
              {
                name: '剣士',
                value: 'fugafuga',
              },
            ],
          },
          {
            type: 'STRING',
            name: 'sex',
            japanese: '性別',
            description: '性別',
            required: true,
            choices: [
              {
                name: '男',
                value: 'm',
              },
              {
                name: '女',
                value: 'f',
              },
            ],
          },
        ],
      },
      {
        type: 'SUB_COMMAND',
        name: 'wiki',
        japanese: '/説明書',
        description: '/説明書 - /パーティーIIについて',
      },
      {
        type: 'SUB_COMMAND',
        name: 'news',
        japanese: '/ニュース',
        description: '/ニュース - 最近の出来事',
      },
      {
        type: 'SUB_COMMAND',
        name: 'contest',
        japanese: '/フォトコン',
        description: '/フォトコン - みんなが撮ったｽｸｰﾌﾟ映像',
      },
      {
        type: 'SUB_COMMAND',
        name: 'player-list',
        japanese: '/ﾌﾟﾚｲﾔｰ一覧',
        description: '/ﾌﾟﾚｲﾔｰ一覧 - 転職回数、レベル順',
      },
      {
        type: 'SUB_COMMAND',
        name: 'guild',
        japanese: '/ギルド勢力',
        description: '/ギルド勢力 - 各ギルドとそのメンバー',
      },
      {
        type: 'SUB_COMMAND',
        name: 'challenge',
        japanese: '/世界記録',
        description: '/世界記録 - /チャレンジの最高記録保持者',
      },
      {
        type: 'SUB_COMMAND',
        name: 'ranking',
        japanese: '/ランキング',
        description: '/ランキング - 活躍しているトッププレイヤー',
      },
      {
        type: 'SUB_COMMAND',
        name: 'legend',
        japanese: '/伝説のﾌﾟﾚｲﾔｰ',
        description: '/伝説のﾌﾟﾚｲﾔｰ - コンプリートプレイヤー',
      },
      {
        type: 'SUB_COMMAND',
        name: 'job-ranking',
        japanese: '/職業ランキング',
        description: '/職業ランキング - 人気の職業は！？',
      },
      {
        type: 'SUB_COMMAND',
        name: 'escape',
        japanese: '/救出処理',
        description: '/救出処理 - バグ救出',
      }
    ],
  },
  {
    name: "pact",
    description: "行動",
    /**
     * 
     * @param {import("discord.js").CommandInteraction} interaction 
     * @param {import("../Server.js").サーバー} server 
     * @returns 
     */
    exec: async (interaction, server) => {
      const プレイヤー = await server.プレイヤー.取得(interaction.member.user.id, true);
      if (プレイヤー === null) {
        interaction.reply("まずは/party new-entryから新規登録をしてください");
        return;
      }
      console.log("工事中");
    },
    options: [預かり所, 武器屋, 一般的な場所].map((場所) => 場所.コマンド.オプションへ())
  },
  {
    name: "pskl",
    description: "戦闘スキル"
  }
]

const commandList = new Map(commands.map(command => [command.name, command]));

export class GuildCommandManager {
  constructor(guild) {
    this.commands = guild.commands;
  }
  async registerCommand() {
    return await this.commands.set(commands);
  }
  /**
   * @param {CommandInteraction} interaction
   * @param {import("../Server.js").サーバー} server
   */
  async onInteraction(interaction, server) {
    await commandList.get(interaction.commandName)?.exec(interaction, server);
  }
}

/**
 *
 * @typedef {Object} ApplicationCommandDefinition
 * @property {ApplicationCommandOptionData} option
 * @property {Function} name The name of the option
 */
