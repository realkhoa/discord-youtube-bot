import { joinVoiceChannel } from "@discordjs/voice";
import { SlashCommandBuilder, Message } from "discord.js";
import { stopMusicPlayer } from "../../utils/musicPlayer";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Clear the queue and disconnect"),
  async execute(interaction: Message) {
    if (!!interaction.member?.voice.channel) {
      const channel = interaction.member.voice.channel;
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });

      stopMusicPlayer(interaction);
      connection.disconnect();
      interaction.reply("Stopped!");
    } else {
      interaction.reply("You must join voice channel to use this command!");
    }
  },
};
