import {
  ActivityType,
  Client,
  IntentsBitField,
  Events,
  Message,
  Collection,
} from "discord.js";

import fs from "fs";
import path from "path";

import config from "./config";
import { IQueueData } from "./types/IQueueData";
import { AudioPlayer } from "@discordjs/voice";

// Manipulate Client of discord.js. Fk ts
declare module "discord.js" {
  export interface Client {
    commands: Collection<unknown, any>;
    audioPlayerList: Map<string, AudioPlayer>;
  }
}

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageTyping,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildVoiceStates,
  ],
});

// Registering Slash Command
client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

client.audioPlayerList = new Map();

// Set bot status
client.once(Events.ClientReady, () => {
  client.user?.setPresence({
    activities: [{ name: "your mom", type: ActivityType.Playing }],
    status: "online",
  });

  console.log(`Logged as ${client.user?.displayName}`);
});

// Handle Slash commands
client.on(Events.InteractionCreate, async (interaction: any) => {
  try {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

// Supress all embeds (like thumbnail,...) on bot mesage
client.on(Events.MessageCreate, async (message: Message) => {
  if (message.author.id === config().botID) {
    message.suppressEmbeds(true);
  }
});

client.login(config().token);
