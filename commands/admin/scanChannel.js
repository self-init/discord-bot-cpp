const { SlashCommandBuilder } = require('discord.js');
const { AttachmentBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('scan')
    .setDescription('Scans the current channel.')
    .addIntegerOption((option) => option.setName('quantity').setDescription('amount of messages to scan')),

    async execute(interaction) {
        const channelId = interaction.channelId;
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


        // Create and save to json file
        const jsonString = JSON.stringify(allMessages, null, 2)

        fs.writeFile(__dirname + "/temp/output.json", jsonString, 'utf8', (err) => {
            if (err) {
                console.error('Error writing to file:', err);
                return;
            }
            console.log('Data written to output.json')
        })

        const file = new AttachmentBuilder(__dirname + "/temp/output.json");
        await interaction.editReply({content: `Got ${allMessages.length} messages!`, files: [file] });



    }
}