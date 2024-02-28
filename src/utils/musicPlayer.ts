import {
    AudioPlayer,
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    VoiceConnection,
} from "@discordjs/voice";
import {Message} from "discord.js";

import * as db from "./db";
import {getStream} from "./playdlAPI";

export async function getGuildAudioPlayer(interaction: Message) {
    return interaction.client.audioPlayerList.get(
      interaction.guild?.id || ""
  );
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
  const botVcID = interaction.guild?.members.me?.voice.channelId;
  const audioPlayer = await getGuildAudioPlayer(interaction);

  if (!audioPlayer) return true; // Audio player has not been created yet

  const playerStatus = audioPlayer.state.status;
  
  if (
    (playerStatus == AudioPlayerStatus.Paused ||
    playerStatus == AudioPlayerStatus.Idle) &&
    botVcID
  ) { // Player is idle and bot is in voice channel
    return true;
  }

  const isEmptyQueue = await db.isEmptyQueue(interaction.guild?.id || "");
  if (isEmptyQueue && botVcID) return true; // Empty queue
  return false;
}

export default async function startMusicPlayer(
  guid: string | undefined,
  connection: VoiceConnection,
  interaction: Message
) {
  const currentSong = await db.getCurrentSong(guid);

  if (currentSong == null) {
    await interaction.channel.send(
      "Queue is empty. Using /play command to add new song to queue!"
    );
    return;
  }

  const stream = await getStream(currentSong.src);
  const player =
    (await getGuildAudioPlayer(interaction)) || createAudioPlayer();
  const resource = createAudioResource(stream.stream);

  player.play(resource);
  connection.subscribe(player);

  await setGuildAudioPlayer(interaction, player);

  await interaction.channel.send("Now playing: " + currentSong.title);

  player.once(AudioPlayerStatus.Paused, async () => {
    await db.shiftQueue(guid);
    await startMusicPlayer(guid, connection, interaction);
  }); // Handle Skip

  player.once(AudioPlayerStatus.Idle, async () => {
    await db.shiftQueue(guid);
    await startMusicPlayer(guid, connection, interaction);
  }); // Handle next song
}

export async function stopMusicPlayer(interaction: Message) {
  await db.clearQueue(interaction.guild?.id || "");
  await dropAudioPlayer(interaction);
}