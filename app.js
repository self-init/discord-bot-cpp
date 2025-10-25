require("dotenv").config();

const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const Sequelize = require('sequelize');
const RecursiveLoader = require('./recursiveLoader');

const token = process.env.TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.commands = new Collection();
RecursiveLoader.load(path.join(__dirname, 'commands'), (command) => {
    client.commands.set(command.data.name, command);
});

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite'
});

client.db = new Collection();
RecursiveLoader.load(path.join(__dirname, 'tables'), (table) => {
    client.db.set(table.name, {
        table: sequelize.define(table.name, table.definition),
        methods: table.methods
    });
});

RecursiveLoader.load(path.join(__dirname, 'events'), (event) => {
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