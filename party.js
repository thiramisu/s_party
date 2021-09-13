"use strict";

import {
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
  Client,
  Permissions,
} from "discord.js"
import { GuildCommandManager } from "./CommandManager.js"
import { 場所 } from "./place/Place.js"

const client = new Client({
  intents: ['GUILDS', 'GUILD_MESSAGES'],
})
const guildCommandManagers = new Map();

client.on('guildCreate', async guild => {
  console.log('サーバー参加時の処理');
})

const onceReady = async () => {
  console.log('start');
  const
    guild = await client.guilds.fetch(process.env.GUILD_ID),
    guildCommandManager = new GuildCommandManager(guild);
  guildCommandManager.registerCommand();
  await guildCommandManagers.set(guild.id, guildCommandManager);
  console.log('ready');
}

client.once('ready', () => onceReady())

client.on('interactionCreate', async interaction => {
  if (interaction.isCommand()) {
    guildCommandManagers.get(interaction.guildId).onInteraction(interaction);
    return;
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)
