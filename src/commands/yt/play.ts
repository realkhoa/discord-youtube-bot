import { joinVoiceChannel } from "@discordjs/voice";
import { SlashCommandBuilder } from "discord.js";

import { addToQueue } from "../../utils/playdlAPI";
import startMusicPlayer from "../../utils/musicPlayer";
import awaiter from "../../utils/awaiter";

import * as db from "../../utils/db";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play audio of Youtube or Soundcloud URL")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("Youtube or Soundcloud")
        .setRequired(true)
    ),
  // Change type to Message if u need to extend it
  async execute(interaction: any) {
    await interaction.reply("Adding song...");

    if (!interaction.member?.voice.channel) {
      await interaction.followUp(
        "You must join voice channel to use this command!"
      );

      return;
    }

    const botVcID = interaction.guild?.members.me?.voice.channelId;
    const channel = interaction.member.voice.channel;
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    const isEmptyQueue = await db.isEmptyQueue(channel.guild.id);

    const videoURL = await interaction.options.getString("url");
    const [videoTitle, addQueueError] = await awaiter(
      addToQueue(interaction, videoURL)
    );

    if (addQueueError) {
      await interaction.followUp(addQueueError.message);
    } else {
      await interaction.followUp("Added " + videoTitle + " to queue");
    }

    // Only start new player when queue is empty or bot not join voice channel yet
    if (isEmptyQueue || !botVcID) {
      startMusicPlayer(interaction.guild?.id, connection, interaction);
    }
  },
};
