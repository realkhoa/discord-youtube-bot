import config from "../../config";
import playdl, {YouTubeStream} from "play-dl";
import {ISongData} from "../../types/ISongData";

import * as db from "../db";

export async function addToQueue(interaction: any, videoURL: string) {
  const vidInfo = await playdl.video_basic_info(videoURL);

  await db.addToQueue(
    {
      src: videoURL,
      title: vidInfo.video_details.title,
      duration: vidInfo.video_details.durationRaw,
    },
    interaction.member.voice.channel.guild.id
  );

  return vidInfo.video_details.title;
}

export async function getPlaylistVideos(url: string) {
  const playlist = await playdl.playlist_info(url, { incomplete: true });
  const videos = await playlist.all_videos();

  return videos.map((e) => {
    return {
      src: e.url,
      title: e.title,
      duration: e.durationRaw,
    };
  }) as Array<ISongData>;
}

export async function getStream(src: string | undefined): Promise<YouTubeStream> {
    return await playdl.stream(src || "", {
      discordPlayerCompatibility: true,
  });
}
