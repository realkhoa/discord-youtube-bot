import { VoiceConnection, getVoiceConnection } from "@discordjs/voice";
import { ChatInputCommandInteraction, GuildMember, VoiceBasedChannel } from "discord.js";

export function getGuildId(interaction: ChatInputCommandInteraction): string {
    if (interaction.guildId === null) throw new Error("Could not get GUID.");
    return interaction.guildId;
}

export function getBotVoiceConnection(interaction: ChatInputCommandInteraction): VoiceConnection {
    const guildId = getGuildId(interaction);

    const connection = getVoiceConnection(guildId);

    if (connection === undefined) throw new Error("Bot not in voice channel.")

    return connection;
}

export function getAuthorVoiceChannel(interaction: ChatInputCommandInteraction): VoiceBasedChannel {
    const interactionAuthor: GuildMember = interaction.member as GuildMember;

    if (interactionAuthor.voice.channel === null)
        throw new Error("Could not find user's voice channel.")

    return interactionAuthor.voice.channel;
}

export function getAuthor(interaction: ChatInputCommandInteraction): GuildMember {
    return interaction.member as GuildMember;
}