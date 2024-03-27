import { joinVoiceChannel, getVoiceConnection } from '@discordjs/voice';
import { SlashCommandBuilder, Message, ApplicationCommandOptionType, SlashCommandStringOption, ChatInputCommandInteraction, chatInputApplicationCommandMention } from 'discord.js';
import { getBotVoiceConnection } from '../../utils/discordUtils';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('disconnect')
		.setDescription('Disconnect bot from voice channel!'),
	async execute(interaction: ChatInputCommandInteraction) {
      const connection = getBotVoiceConnection(interaction);

      connection?.disconnect();
      interaction.reply("Disconnected!");
	},
};