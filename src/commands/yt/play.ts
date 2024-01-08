import {
  AudioPlayerStatus,
  VoiceConnection,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from "@discordjs/voice";
import {
  SlashCommandBuilder,
  Message,
  Client,
  Interaction,
  InteractionType,
} from "discord.js";

import { startMusicPlayer, getGuildQueue, authPlaydl } from "../../utils";

export interface ISongData {
  name: string | undefined;
  url: string | undefined;
  length: string | undefined;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play audio of Youtube or Soundcloud URL")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("Youtube or Soundcloud")
        .setRequired(true)
    ),
  // Change type to Message if u need to extend it
  async execute(interaction: any) {
    await interaction.reply("Adding song...");
    const videoURL = interaction.options.getString("url");
    if (!!interaction.member?.voice.channel) {
      const channel = interaction.member.voice.channel;
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });

      authPlaydl
        .stream(videoURL, {
          discordPlayerCompatibility: true,
        })
        .then((stream) => {
          // Get video Info
          authPlaydl.video_basic_info(videoURL).then((data) => {
            interaction.followUp(
              "Added " + data.video_details.title + " to queue"
            );

            const queue =
              interaction.client.resourceQueues.get(interaction.guild?.id) ||
              [];
            const player = createAudioPlayer();
            const resource = createAudioResource(stream.stream);

            queue.push({
              resource,
              player,
              url: videoURL,
              title: data.video_details.title,
              duration: data.video_details.durationRaw,
            });
            
            interaction.client.resourceQueues.set(interaction.guild?.id, queue);

            if (queue.length == 1) {
              // Only start new player when queue is empty
              startMusicPlayer(interaction.guild?.id, connection, interaction);
            }
          });
        })
        .catch((err: Error) => {
          console.log(err.message);
          interaction.followUp(err.message);
        });
    } else {
      await interaction.followUp(
        "You must join voice channel to use this command!"
      );
    }
  },
};
