import {
    AudioPlayer,
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection,
    joinVoiceChannel,
    NoSubscriberBehavior,
    VoiceConnection,
} from "@discordjs/voice";
import {Message} from "discord.js";

import * as db from "../db";
import {getStream} from "../playdl/playdlAPI";
import { YouTubeStream } from "play-dl";

export async function getGuildAudioPlayer(interaction: Message) {
  const audioPlayer = interaction.client.audioPlayerList.get(
    interaction.guild?.id || "");

  return audioPlayer;
}

export async function dropAudioPlayer(interaction: Message) {
  interaction.client.audioPlayerList.delete(interaction.guild?.id || "");
}

export async function setGuildAudioPlayer(
  interaction: Message,
  player: AudioPlayer
) {
  interaction.client.audioPlayerList.set(interaction.guild?.id || "", player);
}

export async function canStartNewPlayer(interaction: Message) {
  const botVoiceChannelID = interaction.guild?.members.me?.voice.channelId;
  let audioPlayer = await getGuildAudioPlayer(interaction);;

  if (!audioPlayer) return true;

  const playerStatus = audioPlayer.state.status;
  
  if (
    (playerStatus == AudioPlayerStatus.Paused ||
    playerStatus == AudioPlayerStatus.Idle) &&
    botVoiceChannelID
  ) { // Player is idle and bot is in voice channel
    return true;
  }

  const isEmptyQueue = await db.isEmptyQueue(interaction.guild?.id || "");
  if (isEmptyQueue && botVoiceChannelID) return true; // Empty queue
  return false;
}

export default async function startMusicPlayer(
  interaction: Message | any
) {
  const channel = interaction?.member?.voice.channel;
  
  if (!channel) return interaction.channel.send({
    content: "Could not find voice channel!",
    ephemeral: true,
  });

  const guid = channel.guild.id;
  const connection: VoiceConnection | undefined = getVoiceConnection(guid);

  if (!connection) return interaction.channel.send({
    content: "Could not establish connection!",
    ephemeral: true,
  });

  const currentSong = await db.getCurrentSong(guid);

  if (currentSong == null) {
    await interaction.channel.send({
      content: "Queue is empty. Use /play command to add new song to queue!",
      ephemeral: true,
    });
    return;
  }

  var stream: YouTubeStream;
  try {
    stream = await getStream(currentSong.src);
  } catch(e) {
    await interaction.channel.send({
      content: `Some error occur while getting video audio. Skipping...\nTitle: [${currentSong.title}](${currentSong.src})`,
      ephemeral: true,
    });

    await skipToNextSong(interaction);
    return;
  }
  const player = await getGuildAudioPlayer(interaction) || createAudioPlayer();
  const resource = createAudioResource(stream.stream);

  player.play(resource);
  connection.subscribe(player);

  await setGuildAudioPlayer(interaction, player);

  await interaction.channel.send("Now playing: " + currentSong.title);

  player.once(AudioPlayerStatus.Idle, async () => {
    await db.shiftQueue(guid);
    await startMusicPlayer(interaction);
  }); // Handle next song
}

export async function stopMusicPlayer(interaction: Message) {
  await db.clearQueue(interaction.guild?.id || "");
  await dropAudioPlayer(interaction);
}

export async function skipToNextSong(interaction: Message | any) {
  const channel = interaction?.member?.voice.channel;
  const player = await getGuildAudioPlayer(interaction);
  
  if (!channel) return interaction.channel.send(
    "Could not find user in any channel."
  );

  const guid = channel.guild.id;

  if (!player) interaction.channel.send({
    content: "Could not get guild player. Starting new one...",
    ephemeral: true,
  });

  await db.shiftQueue(guid);
  dropAudioPlayer(interaction);
  await startMusicPlayer(interaction);
}