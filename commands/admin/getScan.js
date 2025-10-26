const { SlashCommandBuilder } = require('discord.js');
const { AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('getscan')
    .setDescription('sends the message json for the current channel'),

    async execute(interaction) {
        const channelId = interaction.channelId;
        const guildId = interaction.guildId;
        let channel = interaction.client.channels.cache.get(channelId);
        await interaction.deferReply();

        // Define path variables

        const dirPath = path.join(__dirname, 'temp', 'data', guildId);
        const filePath = path.join(dirPath, `${channelId}.json`);

        // Check if directory exists

        if (fs.existsSync(filePath)) {
            const file = new AttachmentBuilder(filePath);
            await interaction.editReply({content: `Here you go!`, files: [file] })

        } else {
            await interaction.editReply({content: `Couldnt find it, run /scan`})
        };




    }
};