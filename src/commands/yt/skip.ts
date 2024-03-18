import { SlashCommandBuilder } from "discord.js";
import * as db from "../../utils/db";
import { skipToNextSong } from "../../utils/musicPlayer/musicPlayer";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip to next song"),
  async execute(interaction: any) {
    await interaction.reply({
      content: "Skipping...",
      ephemeral: true,
    });

    if (!interaction.member?.voice.channel) {
      await interaction.followUp({
        content: "You must join a voice channel to use this command.",
        ephemeral: true,
      });
      return;
    }
    const guid = interaction.guild?.id;
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
