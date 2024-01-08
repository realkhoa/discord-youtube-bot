import {
  AudioPlayer,
  AudioPlayerStatus,
  AudioResource,
  VoiceConnection,
} from "@discordjs/voice";
import { Message } from "discord.js";
import playdl, { video_basic_info } from "play-dl";
import loadConfig from "./config";
import { IQueueData } from "./types/IQueueData";
import { ISongData } from "./types/ISongData";

playdl.setToken({
  youtube: {
    cookie: loadConfig().youtubeCookies,
  },
});

export function startMusicPlayer(
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

export function getGuildQueue(interaction: Message): Array<ISongData> {
  const queue = interaction.client.resourceQueues.get(interaction.guild?.id);

  return queue?.map((e) => {
    return {
      url: e.url,
      name: e.title,
      length: e.duration,
    };
  }) as Array<ISongData>;
}

export function formatQueue(queue: Array<ISongData>): string {
  return queue
    .map((e, index) => `${index}. [${e.name}](${e.url}) : ${e.length}`)
    .join("\n");
}

export const authPlaydl = playdl;
