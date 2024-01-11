import { joinVoiceChannel } from "@discordjs/voice";
import { SlashCommandBuilder } from "discord.js";

import { addToQueue } from "../../utils/playdlAPI";
import startMusicPlayer from "../../utils/startMusicPlayer";

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
    if (!!interaction.member?.voice.channel) {
      const channel = interaction.member.voice.channel;
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });

      
      try {
        const videoURL = await interaction.options.getString("url");
        const videoTitle = await addToQueue(interaction, videoURL);
        const queue = await interaction.client.resourceQueues.get(interaction.guild?.id) || [];

        await interaction.followUp("Added " + videoTitle + " to queue");

        if (queue.length == 1) {
          // Only start new player when queue is empty
          startMusicPlayer(interaction.guild?.id, connection, interaction);
        }
      } catch (error: any) {
        await interaction.followUp(error.message);
      }
      
    } else {
      await interaction.followUp(
        "You must join voice channel to use this command!"
      );
    }
  },
};
