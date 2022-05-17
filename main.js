const { Client, Intents } = require('discord.js');
require('dotenv').config()

const client = new Client ({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () => {
    console.log('Pokédex is online!');
});

client.login(process.env.TOKEN);