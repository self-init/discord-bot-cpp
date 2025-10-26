const { SlashCommandBuilder } = require('discord.js');
const { AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('scan')
    .setDescription('Scans the current channel.')
    .addIntegerOption((option) => option.setName('quantity').setDescription('amount of messages to scan')),

    async execute(interaction) {
        const channelId = interaction.channelId;
        const guildId = interaction.guildId;
        const messageQuantity = interaction.options.getInteger('quantity') ?? 500;
        let channel = interaction.client.channels.cache.get(channelId);
        
        let allMessages = [];
        let lastId;

        await interaction.deferReply();
        
        while (true) {
            const options = {limit: 100};
            if (lastId) {
                options.before = lastId;
            }

            const fetchedMessages = await channel.messages.fetch(options);
            if (allMessages.length >= messageQuantity) break;

            allMessages = allMessages.concat(Array.from(fetchedMessages.values()));
            lastId = fetchedMessages.last().id;
            console.log("Scanning messages");
            await interaction.editReply(`Scanned ${allMessages.length} messages...`)
        }
        console.log("Scanned all messages");



        // Check if directory exists


        const dirPath = path.join(__dirname, 'temp', 'data', guildId)
        const filePath = path.join(dirPath, `${channelId}.json`)

        try {
            fs.mkdirSync(dirPath, { recursive: true});
            const jsonString = JSON.stringify(allMessages, null, 2)
            fs.writeFileSync(filePath, jsonString, 'utf8');


        } catch (err) {
            console.error('Error writing to file: ', err);
        }
        
        // send attachment
        const file = new AttachmentBuilder(filePath);
        await interaction.editReply({content: `Got ${allMessages.length} messages!`, files: [file] });



    }
}