const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message) {
        const client = message.client
        const Users = client.db.get("users");
        console.log(`${message.author.username} sent a message!`);
        const user = await Users.table.findOne({ where: { user_id: message.author.id }});

        if (user) {
            user.increment('message_count');
        } else {
            const newUser = await Users.table.create({
                user_id: message.author.id,
                name: message.author.username,
                message_count: 1
            });
        }
    },
};