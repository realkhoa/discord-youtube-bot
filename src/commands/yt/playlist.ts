import { SlashCommandBuilder } from "discord.js";
import { addToQueue, getPlaylistVideos } from "../../utils/playdl/playdlAPI";
import { joinVoiceChannel } from "@discordjs/voice";
import startMusicPlayer, { canStartNewPlayer } from "../../utils/musicPlayer/musicPlayer";
import awaiter from "../../utils/awaiter";
import { getAuthorVoiceChannel, getBotVoiceConnection } from "../../utils/discordUtils";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playlist")
    .setDescription("Add playlist to queue")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("Youtube or Soundcloud")
        .setRequired(true)
    ),
  async execute(interaction: any) {
    await interaction.reply({
      content: "Getting playlist info...",
      ephemeral: true,
    });

    const authorVoiceChannel = getAuthorVoiceChannel(interaction);
    const botVoiceConnection = getBotVoiceConnection(interaction);

    const playlistURL = await interaction.options.getString("url")!; // Required Field. Safe to do this

    const videos = await getPlaylistVideos(playlistURL)

    const bulkQueue = videos.map(async (e) => addToQueue(interaction, e.src!));

    await Promise.all(bulkQueue);

    interaction.followUp("Added " + videos!.length + " videos to queue");

    if (await canStartNewPlayer(interaction)) {
      await startMusicPlayer(interaction);
    }
  },
};
