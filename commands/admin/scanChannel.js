const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('scan').setDescription('Scans the current channel.'),
    async execute(interaction) {
        const channelId = interaction.channelId;
        const client = interaction.client;
        let channel = client.channels.cache.get(channelId);
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
            await interaction.editReply(`Scanned ${allMessages.length} messages...`)
        }
        console.log("Scanned all messages");

        await interaction.editReply(`Got ${allMessages.length} messages!`);

        const Users = client.db.get("users");

        allMessages.forEach(async (message) => {
            const user = await Users.table.findOne({ where: { user_id: message.author.id }});
            if (user) {
                user.increment('message_count');
            } else {
                try {
                    const newUser = await Users.table.create({
                        user_id: message.author.id,
                        name: message.author.username,
                        message_count: 1
                    });
                } catch(err) {
                    //console.error(err);
                }
            }
        })
    }
}