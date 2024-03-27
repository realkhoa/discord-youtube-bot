import { joinVoiceChannel } from "@discordjs/voice";
import { SlashCommandBuilder, Message, ChatInputCommandInteraction } from "discord.js";
import { stopMusicPlayer } from "../../utils/musicPlayer/musicPlayer";
import { getBotVoiceConnection, getAuthorVoiceChannel } from "../../utils/discordUtils";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Clear the queue and disconnect"),
  async execute(interaction: ChatInputCommandInteraction) {

    const authorVoiceChannel = getAuthorVoiceChannel(interaction);
    const botVoiceConnection = getBotVoiceConnection(interaction)

    await stopMusicPlayer(interaction);
    botVoiceConnection.disconnect();
    await interaction.reply("Stopped!");
  },
};
