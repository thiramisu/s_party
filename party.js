// @ts-check
"use strict";

import {
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
  Client,
  Permissions,
} from "discord.js"
import { GuildCommandManager } from "./CommandManager.js"
import { ServerManager } from "./ServerManager.js";
import { 殿堂の名前 } from "./logger/HallOfFame.js";
import { Spreadsheet } from "./SpreadSheet.js";

const client = new Client({
  intents: ['GUILDS', 'GUILD_MESSAGES'],
})
const serverManager = new ServerManager();
const guildCommandManagers = new Map();

client.on('guildCreate', async guild => {
  console.log('サーバー参加時の処理');
})

const onceReady = async () => {
  console.log('start');
  const
    guild = client.guilds.cache.get(process.env.GUILD_ID),
    guildCommandManager = new GuildCommandManager(guild);
  guildCommandManager.registerCommand();
  guildCommandManagers.set(guild.id, guildCommandManager);
  console.log('ready');
}

client.once('ready', onceReady)

client.on('interactionCreate', async interaction => {
  if (interaction.isCommand()) {
    const サーバー = await serverManager.取得(interaction.guild);
    guildCommandManagers.get(interaction.guildId).onInteraction(interaction);
    (await サーバー.殿堂.取得(殿堂の名前.職業)).プレイヤー追加({
      名前: "hoge",
      色: "#EEDD33",
      ギルド: "ほげ",
      アイコン: "https://i.imgur.com/Qfho4Cu.png"
    });
    const hoge = await Spreadsheet.searchServer("13");
    サーバー.ニュース.書き込む(hoge.toString());
    return;
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)
