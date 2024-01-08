import { SlashCommandBuilder, Message } from "discord.js";
import { video_basic_info } from "play-dl";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip to next song"),
  async execute(interaction: any) {
    interaction.reply("Skipping...");
    if (!!interaction.member?.voice.channel) {
      const queue = interaction.client.resourceQueues.get(
        interaction.guild?.id
      );
      if (queue && queue.length > 1) {
        interaction.followUp("Skipping " + queue[0].title);
        queue[0].player.pause();
      } else {
        interaction.followUp(
          "There are no songs to skip or the bot is not in a voice channel."
        );
      }
    } else {
      interaction.followUp("You must join voice channel to use this command!");
    }
  },
};
