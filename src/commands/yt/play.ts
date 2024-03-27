import { joinVoiceChannel, VoiceConnection} from "@discordjs/voice";
import { ChatInputCommandInteraction, CommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";

import { addToQueue } from "../../utils/playdl/playdlAPI";
import startMusicPlayer, { canStartNewPlayer } from "../../utils/musicPlayer/musicPlayer";
import awaiter from "../../utils/awaiter";
import { getAuthor, getAuthorVoiceChannel } from "../../utils/discordUtils";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play audio of Youtube or Soundcloud URL, or name.")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("Youtube URL or query")
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
      content: "Adding...",
      ephemeral: true,
    });

    const author = getAuthor(interaction);
    const authorVoiceChannel = getAuthorVoiceChannel(interaction);

    const connection: VoiceConnection = joinVoiceChannel({
      channelId: authorVoiceChannel.id,
      guildId: authorVoiceChannel.guild.id,
      adapterCreator: authorVoiceChannel.guild.voiceAdapterCreator,
    });

    const videoURL = await interaction.options.getString("url")!; // Required Field. Safe to do this
    const videoTitle = await addToQueue(interaction, videoURL)

    await interaction.channel?.send({
      content: author.toString() + " added " + videoTitle + " to queue"
    })

    if (await canStartNewPlayer(interaction)) {
      await startMusicPlayer(interaction);
    }
  },
};
