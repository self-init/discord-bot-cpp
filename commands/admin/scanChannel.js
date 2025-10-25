const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('scan').setDescription('Scans the current channel.'),
    async execute(interaction) {
        const channelId = interaction.channelId;
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
            if (fetchedMessages.size === 0) break;

            allMessages = allMessages.concat(Array.from(fetchedMessages.values()));
            lastId = fetchedMessages.last().id;
            console.log("Scanning messages");
            await interaction.editReply(`Scanned ${allMessages.length} messages...`)
        }
        console.log("Scanned all messages");

        await interaction.editReply(`Got ${allMessages.length} messages!`);
    }
}