import { SlashCommandBuilder, Message } from "discord.js";
import { addToQueue, addToQueueWithDetail, getPlaylistVideos } from "../../utils/playdlAPI";
import { joinVoiceChannel } from "@discordjs/voice";
import startMusicPlayer from "../../utils/startMusicPlayer";
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
    await interaction.reply("Getting playlist info...");

    if (!interaction.member?.voice.channel) {
      interaction.followUp("You must join voice channel to use this command!");
      return;
    }

      const channel = interaction.member.voice.channel;
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });

      const oldQueue = await interaction.client.resourceQueues.get(interaction.guild?.id) || [];
      const isNewQueue = oldQueue == 0;
      const playlistURL = await interaction.options.getString("url");

      const [videos, getPlayListVideoError] = await awaiter(getPlaylistVideos(playlistURL));

      if (getPlayListVideoError) {
        await interaction.followUp(getPlayListVideoError.message);

        return;
      }

      const bulkQueue = videos!.map(async (e) => addToQueueWithDetail(interaction, e));

      await Promise.all(bulkQueue)

      interaction.followUp(
        "Added " + videos!.length + " videos to queue"
      );

      // Only start new player when queue is empty
      if (isNewQueue) {
        startMusicPlayer(interaction.guild?.id, connection, interaction);
      }
  },
};
