import { Message } from "discord.js";
import { ISongData } from "../types/ISongData";

const NUMBER_OF_DISPLAY_ITEMS = 10;

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
  let hasHiddenItems = queue.length - NUMBER_OF_DISPLAY_ITEMS > 0;
  let footer = ""

  if(hasHiddenItems) footer = `${queue.length - NUMBER_OF_DISPLAY_ITEMS} hidden items`;

  return queue
    .slice(0, NUMBER_OF_DISPLAY_ITEMS)
    .map((e, index) => `${index}. [${e.name}](${e.url}) : ${e.length}`)
    .join("\n")
    .concat("\n" + footer);
}