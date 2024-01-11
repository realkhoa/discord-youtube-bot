import { createAudioPlayer, createAudioResource } from "@discordjs/voice";
import loadConfig from "../config";
import playdl from "play-dl";
import { ISongData } from "../types/ISongData";

playdl.setToken({
  youtube: {
    cookie: loadConfig().youtubeCookies,
  },
});


export async function addToQueue(interaction: any, videoURL: string) {
  const stream = await playdl
    .stream(videoURL, {
      discordPlayerCompatibility: true,
    })

  const vidInfo = await playdl.video_basic_info(videoURL)
  const queue = await interaction.client.resourceQueues.get(interaction.guild?.id) || [];
  const player = createAudioPlayer();
  const resource = createAudioResource(stream.stream);

  queue.push({
    resource,
    player,
    url: videoURL,
    title: vidInfo.video_details.title,
    duration: vidInfo.video_details.durationRaw,
  });

  interaction.client.resourceQueues.set(interaction.guild?.id, queue);

  return vidInfo.video_details.title;
}

export async function getPlaylistVideos(url: string) {
  const playlist = await playdl.playlist_info(url, { incomplete: true });
  const videos = await playlist.all_videos();

  return videos.map((e) => {
    return {
      url: e.url,
      name: e.title,
      length: e.durationRaw,
    };
  }) as Array<ISongData>;
}