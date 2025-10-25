require("dotenv").config();

const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const Sequelize = require('sequelize');
const RecursiveFileCollector = require('./recursiveFileCollector');

const token = process.env.TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.reloadCommands = () => {
    client.commands = new Collection();
    RecursiveFileCollector(path.join(__dirname, 'commands')).forEach(commandPath => {
        delete require.cache[require.resolve(commandPath)];
        command = require(commandPath);
        client.commands.set(command.data.name, command);
    });
}

client.reloadCommands();

// Initialize database
const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite'
});

// Load tables
client.db = new Collection();
RecursiveFileCollector(path.join(__dirname, 'tables')).forEach(tablePath => {
    const table = require(tablePath);
    client.db.set(table.name, {
        table: sequelize.define(table.name, table.definition),
        methods: table.methods
    });
});

// Load events
RecursiveFileCollector(path.join(__dirname, 'events')).forEach(eventPath => {
    const event = require(eventPath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
})

client.login(token);


// const express = require("express");

// const app = express();
// const port = 3000;

// app.get("/", async (req, res) => {
//     const userList = await client.db.get("users").table.findAll({ attributes: ['name', 'message_count'] });
//     const userString = userList.map(t => t.name + " " + String(t.message_count)).join('<br>') || 'No messages received.';

//     res.send(userString);
// });

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${3000}`);
// });