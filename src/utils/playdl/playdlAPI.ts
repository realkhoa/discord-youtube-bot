import config from "../../config";
import playdl, { YouTubeStream } from "play-dl";
import { ISongData } from "../../types/ISongData";

import * as db from "../db";

export async function getVideoInfo(query: string): Promise<ISongData> {
  let vidInfo = undefined;

  if (query.startsWith('https') && playdl.yt_validate(query) === 'video') {
    const vidBasicInfo = await playdl.video_basic_info(query);

    vidInfo = {
      src: vidBasicInfo.video_details.url,
      title: vidBasicInfo.video_details.title,
      duration: vidBasicInfo.video_details.durationRaw,
    }
  } else {
    const searched = await playdl.search(query, { source : { youtube : "video" } })
    

    vidInfo = {
      src: searched[0].url,
      title: searched[0].title,
      duration: searched[0].durationRaw,
    }
  }

  if (vidInfo === undefined) throw new Error("Could not get video info!");

  return vidInfo;
}

export async function addToQueue(interaction: any, videoURL: string) {
  const vidInfo = await getVideoInfo(videoURL);

  await db.addToQueue(
    vidInfo,
    interaction.member.voice.channel.guild.id
  );

  return vidInfo.title;
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
