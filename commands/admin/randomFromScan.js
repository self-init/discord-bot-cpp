const { SlashCommandBuilder } = require('discord.js');
const { AttachmentBuilder } = require('discord.js');
const fs = require('fs').promises;


module.exports = {
    data: new SlashCommandBuilder()
    .setName('random')
    .setDescription('Sends a random message from the previous /scan'),

    async execute(interaction) {
        const channelId = interaction.channelId;
        let channel = interaction.client.channels.cache.get(channelId);

        async function handleInteraction(interaction) {
            const data = await fs.readFile(__dirname + "/temp/output.json", 'utf8');

            const messages = JSON.parse(data);
            const randomIndex = Math.floor(Math.random() * messages.length);
            const randomMessage = messages[randomIndex];
            await interaction.reply(`${randomMessage.cleanContent}`)


        }

        handleInteraction(interaction)



    



    }
};