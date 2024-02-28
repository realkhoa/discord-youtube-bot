import { SlashCommandBuilder } from "discord.js";
import { formatQueue } from "../../utils/queue";

import * as db from "../../utils/db";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Get guild queue"),
  async execute(interaction: any) {
    await interaction.reply("Getting queue...");

    if (!interaction.member?.voice.channel) {
      interaction.followUp("You must join voice channel to use this command!");
      return;
    }

    const queue = await db.getQueue(interaction.member.voice.channel.guild.id);
    if (queue && queue.length >= 1)
      return interaction.followUp("Current queue: \n" + formatQueue(queue));

    interaction.followUp("Empty queue.");
  },
};
