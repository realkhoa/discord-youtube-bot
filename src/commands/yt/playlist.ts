import { SlashCommandBuilder, Message } from "discord.js";
import { addToQueue, getPlaylistVideos } from "../../utils/playdlAPI";
import { joinVoiceChannel } from "@discordjs/voice";
import startMusicPlayer from "../../utils/startMusicPlayer";

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
    if (!!interaction.member?.voice.channel) {
      const channel = interaction.member.voice.channel;
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });

      try {
        const oldQueue = await interaction.client.resourceQueues.get(interaction.guild?.id) || [];
        const isNewQueue = oldQueue == 0;

        const playlistURL = await interaction.options.getString("url");
        const videos = await getPlaylistVideos(playlistURL);

        const bulkQueue = videos.map(async (e) => addToQueue(interaction, e.url || ""));

        Promise.all(bulkQueue)
          .then((data) => {
            interaction.followUp(
              "Added " + videos.length + " videos to queue"
            );

            if (isNewQueue) {
              // Only start new player when queue is empty
              startMusicPlayer(interaction.guild?.id, connection, interaction);
            }
          })
      } catch (error: any) {
        await interaction.followUp(error.message);
      }
    } else {
      interaction.followUp("You must join voice channel to use this command!");
    }
  },
};
