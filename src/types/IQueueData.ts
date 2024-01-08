import { AudioPlayer, AudioResource } from "@discordjs/voice";

export interface IQueueData {
  resource: AudioResource;
  player: AudioPlayer;
  url: string;
  title?: string;
  duration?: string
}