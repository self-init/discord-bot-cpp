const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('reload').setDescription('Reloads commands.'),
    async execute(interaction) {
        interaction.client.reloadCommands();
        interaction.reply('Reloaded commands!');
    }
}