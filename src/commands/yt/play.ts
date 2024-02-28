import {joinVoiceChannel, VoiceConnection} from "@discordjs/voice";
import { SlashCommandBuilder } from "discord.js";

import { addToQueue } from "../../utils/playdlAPI";
import startMusicPlayer, { canStartNewPlayer } from "../../utils/musicPlayer";
import awaiter from "../../utils/awaiter";

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

    const channel = interaction.member.voice.channel;
    const connection: VoiceConnection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    const videoURL = await interaction.options.getString("url");
    const [videoTitle, addQueueError] = await awaiter(
      addToQueue(interaction, videoURL)
    );

    if (addQueueError) {
      await interaction.followUp(addQueueError.message);
    } else {
      await interaction.followUp("Added " + videoTitle + " to queue");
    }

    if (await canStartNewPlayer(interaction)) {
      await startMusicPlayer(interaction.guild?.id, connection, interaction);
    }
  },
};
