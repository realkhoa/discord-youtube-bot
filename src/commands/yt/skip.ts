import { SlashCommandBuilder } from "discord.js";
import * as db from "../../utils/db";
import { getGuildAudioPlayer } from "../../utils/musicPlayer";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip to next song"),
  async execute(interaction: any) {
    await interaction.reply("Skipping...");

    if (!interaction.member?.voice.channel) {
      interaction.followUp("You must join voice channel to use this command!");
      return;
    }
    const guid = interaction.guild?.id;
    const isEmptyQueue = await db.isEmptyQueue(guid);

    if (!isEmptyQueue) {
      const player = await getGuildAudioPlayer(interaction);
      // Just pause the player. See musicPlayer.ts file for more information.
      player?.pause();
      return;
    }

    interaction.followUp(
      "There are no songs to skip or the bot is not in a voice channel."
    );
  },
};
