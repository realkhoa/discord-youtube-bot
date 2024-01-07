import { SlashCommandBuilder, Message } from "discord.js";
import { video_basic_info } from "play-dl";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip to next song"),
  async execute(interaction: Message) {
    if (!!interaction.member?.voice.channel) {
      const queue = interaction.client.resourceQueues.get(interaction.guild?.id);

      if (queue && queue.length > 1) {
        video_basic_info(queue[0].url)
          .then(data => {
            interaction.reply("Skipping " + data.video_details.title)
          })
        
        queue[0].player.pause();
      } else {
        interaction.reply(
          "There are no songs to skip or the bot is not in a voice channel."
        );
      }
    } else {
      interaction.reply(
        "You must join voice channel to use this command!"
      );
    }
  }
}