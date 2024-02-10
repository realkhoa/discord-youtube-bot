import { Client } from "discord.js";

declare module "discord.js" {
  export interface Client extends Client {
    commands: Collection<unknown, any>;
    audioPlayerList: Map<string | undefined, AudioPlayer>;
  }
}
