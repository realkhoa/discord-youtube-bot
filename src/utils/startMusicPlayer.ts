import { AudioPlayerStatus, VoiceConnection } from "@discordjs/voice";
import { Message } from "discord.js";
import { IQueueData } from "../types/IQueueData";

export default function startMusicPlayer(
  guid: string | undefined,
  connection: VoiceConnection,
  interaction: Message
) {
  const client = interaction.client;
  const queue: Array<IQueueData> = client.resourceQueues.get(guid) || [];

  if (!queue || queue.length === 0) {
    interaction.channel.send(
      "Queue is empty. Using /play command to add new song to queue!"
    );
    client.resourceQueues.delete(guid);
    return;
  }

  const { player, resource, url, title, duration } = queue[0];

  player.play(resource);
  connection.subscribe(player);

  interaction.channel.send("Now playing: " + title);

  player.once(AudioPlayerStatus.Paused, () => {
    queue.shift();
    startMusicPlayer(guid, connection, interaction);
  }); // Handle Skip

  player.once(AudioPlayerStatus.Idle, () => {
    queue.shift();
    startMusicPlayer(guid, connection, interaction);
  }); // Handle next song
}