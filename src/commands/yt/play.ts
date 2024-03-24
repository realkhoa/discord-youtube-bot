import {joinVoiceChannel, VoiceConnection} from "@discordjs/voice";
import { SlashCommandBuilder } from "discord.js";

import { addToQueue } from "../../utils/playdl/playdlAPI";
import startMusicPlayer, { canStartNewPlayer } from "../../utils/musicPlayer/musicPlayer";
import awaiter from "../../utils/awaiter";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play audio of Youtube or Soundcloud URL, or name.")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("Youtube URL or query")
        .setRequired(true)
    ),
  // Change type to Message if u need to extend it
  async execute(interaction: any) {
    await interaction.reply({
      content: "Adding...",
      ephemeral: true,
    });

    if (!interaction.member?.voice.channel) {
      await interaction.followUp({
        content: "You must join voice channel to use this command!",
        ephemeral: true,
      });
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
      await interaction.followUp({
        content: addQueueError.message,
        ephemeral: true,
      });
    } else {
      await interaction.followUp({
        content: "Added " + videoTitle + " to queue",
      });
    }

    if (await canStartNewPlayer(interaction)) {
      await startMusicPlayer(interaction);
    }
  },
};
