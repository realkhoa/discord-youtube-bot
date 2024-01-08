import { SlashCommandBuilder, Interaction } from "discord.js";
import { video_basic_info } from "play-dl";
import { formatQueue, getGuildQueue } from "../../utils";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Get guild queue"),
  async execute(interaction: any) {
    if (!!interaction.member?.voice.channel) {
      const queue = interaction.client.resourceQueues.get(
        interaction.guild?.id
      );

      await interaction.reply("Getting queue...");

      if (queue && queue.length > 1) {
          interaction.followUp("Current queue: \n" + formatQueue(getGuildQueue(interaction)));
      } else {
        interaction.followUp("Empty queue.");
      }
    } else {
      interaction.reply("You must join voice channel to use this command!");
    }
  },
};
