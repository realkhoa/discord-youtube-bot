import { SlashCommandBuilder } from "discord.js";
import { addToQueue, getPlaylistVideos } from "../../utils/playdl/playdlAPI";
import { joinVoiceChannel } from "@discordjs/voice";
import startMusicPlayer, { canStartNewPlayer } from "../../utils/musicPlayer/musicPlayer";
import awaiter from "../../utils/awaiter";

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

    if (!interaction.member?.voice.channel) {
      interaction.followUp({
        content: "You must join voice channel to use this command!",
        ephemeral: true,
      });
      return;
    }

    const channel = interaction.member.voice.channel;
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    const playlistURL = await interaction.options.getString("url");

    const [videos, getPlayListVideoError] = await awaiter(
      getPlaylistVideos(playlistURL)
    );

    if (getPlayListVideoError) {
      await interaction.followUp(getPlayListVideoError.message);

      return;
    }

    const bulkQueue = videos!.map(async (e) => addToQueue(interaction, e.src!));

    await Promise.all(bulkQueue);

    interaction.followUp("Added " + videos!.length + " videos to queue");

    if (await canStartNewPlayer(interaction)) {
      await startMusicPlayer(interaction);
    }
  },
};
