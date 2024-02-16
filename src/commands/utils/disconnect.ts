import { joinVoiceChannel } from '@discordjs/voice';
import { SlashCommandBuilder, Message, ApplicationCommandOptionType, SlashCommandStringOption } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('disconnect')
		.setDescription('Disconnect bot from voice channel!'),
	async execute(interaction: any) {
		const channel = interaction?.member?.voice.channel;
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });

      connection.disconnect();
      interaction.reply("Disconnected!");
	},
};