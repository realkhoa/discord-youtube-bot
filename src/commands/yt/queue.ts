import { SlashCommandBuilder } from "discord.js";
import { formatQueue } from "../../utils/queue";

import * as db from "../../utils/db";
import { getAuthorVoiceChannel, getBotVoiceConnection, getGuildId } from "../../utils/discordUtils";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Get guild queue"),
  async execute(interaction: any) {
    await interaction.reply({
      content: "Getting queue...",
      ephemeral: true,
    });

    const authorVoiceChannel = getAuthorVoiceChannel(interaction);
    const botVoiceConnection = getBotVoiceConnection(interaction);
    const guildId = getGuildId(interaction)

    const queue = await db.getQueue(guildId);
    if (queue && queue.length >= 1)
      return interaction.followUp("Current queue: \n" + formatQueue(queue));

    interaction.followUp("Empty queue.");
  },
};
