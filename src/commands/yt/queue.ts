import { SlashCommandBuilder, Message } from "discord.js";
import { video_basic_info } from "play-dl";
import { formatQueue, getGuildQueue } from "../../utils";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Get guild queue"),
  async execute(interaction: Message) {
    if (!!interaction.member?.voice.channel) {
      const queue = interaction.client.resourceQueues.get(interaction.guild?.id);

      if (queue && queue.length > 1) {
        getGuildQueue(interaction)
          .then((guildQueue) => {
            interaction.reply("Current queue: \n" + formatQueue(guildQueue))
          })
      } else {
        interaction.reply(
          "Empty queue."
        );
      }
    } else {
      interaction.reply(
        "You must join voice channel to use this command!"
      );
    }
  }
}