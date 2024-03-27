import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import * as db from "../../utils/db";
import { skipToNextSong } from "../../utils/musicPlayer/musicPlayer";
import { getBotVoiceConnection, getGuildId, getAuthorVoiceChannel } from "../../utils/discordUtils";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip to next song"),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
      content: "Skipping...",
      ephemeral: true,
    });

    // Only call to check if author or bot is in voice channel
    const authorVoiceChannel = getAuthorVoiceChannel(interaction);
    const botVoiceConnection = getBotVoiceConnection(interaction);

    const guid = getGuildId(interaction);
    const isEmptyQueue = await db.isEmptyQueue(guid);

    if (!isEmptyQueue) {
      skipToNextSong(interaction);
      return;
    }

    interaction.followUp(
      "There are no songs to skip or the bot is not in a voice channel."
    );
  },
};
