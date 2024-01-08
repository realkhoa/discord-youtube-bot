import {
  AudioPlayer,
  AudioPlayerStatus,
  AudioResource,
  VoiceConnection,
} from "@discordjs/voice";
import { Message } from "discord.js";
import playdl, { video_basic_info } from "play-dl";
import loadConfig from "./config";

playdl.setToken({
  youtube: {
    cookie: loadConfig().youtubeCookies
  }
})

export interface ISongData {
  name: string | undefined;
  url: string | undefined;
  length: string | undefined;
}

export interface IQueueData {
  resource: AudioResource;
  player: AudioPlayer;
  url: string;
}

export function startMusicPlayer(
  guid: string | undefined,
  connection: VoiceConnection,
  interaction: Message
) {
  const client = interaction.client;
  const queue = client.resourceQueues.get(guid);

  if (!queue || queue.length === 0) {
    interaction.channel.send(
      "Queue is empty. Using /play command to add new song to queue!"
    );
    client.resourceQueues.delete(guid);
    return;
  }

  const { player, resource, url } = queue[0];

  player.play(resource);
  connection.subscribe(player);

  video_basic_info(url).then((data) => {
    interaction.channel.send("Now playing: " + data.video_details.title);
  });

  player.once(AudioPlayerStatus.Paused, () => {
    queue.shift();
    startMusicPlayer(guid, connection, interaction);
  }); // Handle Skip

  player.once(AudioPlayerStatus.Idle, () => {
    queue.shift();
    startMusicPlayer(guid, connection, interaction);
  }); // Handle next song
}

export async function getGuildQueue(
  interaction: Message
): Promise<Array<ISongData>> {
  const queue = interaction.client.resourceQueues.get(interaction.guild?.id);

  const urls = queue?.map((e) => e.url);

  if (!urls) return [];

  const details = [];

  for (let url of urls) {
    let detail = await video_basic_info(url);

    details.push({
      url,
      name: detail.video_details.title,
      length: detail.video_details.durationRaw,
    });
  }

  return details;
}

export function formatQueue(queue: Array<ISongData>): string {
  return queue
    .map((e, index) => `${index}. [${e.name}](${e.url}) : ${e.length}`)
    .join("\n");
}

export const authPlaydl = playdl;