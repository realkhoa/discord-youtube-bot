import { SlashCommandBuilder, Message, ApplicationCommandOptionType, SlashCommandStringOption } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction: Message) {
		await interaction.reply('Pong!');
	},
};