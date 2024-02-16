import { SlashCommandBuilder } from "discord.js";
import { addToQueue, getPlaylistVideos } from "../../utils/playdlAPI";
import { joinVoiceChannel } from "@discordjs/voice";
import startMusicPlayer, { canStartNewPlayer } from "../../utils/musicPlayer";
import awaiter from "../../utils/awaiter";

import * as db from "../../utils/db";

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

    const botVcID = interaction.guild?.members.me?.voice.channelId;
    const channel = interaction.member.voice.channel;
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    const oldQueue = (await db.getQueue(interaction.guild?.id)) || [];
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
      startMusicPlayer(interaction.guild?.id, connection, interaction);
    }
  },
};