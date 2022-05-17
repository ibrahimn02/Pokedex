import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js');
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});
const config = require('./config.json');
require('dotenv').config()
import fetch from 'node-fetch';
let name = "";
let image = '';

client.on('ready', () => {
    console.log('Pokédex is online!');
    client.user.setActivity("Pokémon", { type: 'PLAYING' });
});

client.on("messageCreate", msg => {
    async function getData(response){
        let result;
        console.log(response);


        if(response.status == 404){
            console.log("NOT FOUND");
            msg.channel.send("Pokémon not found");
            return;

        } else{
            result = await response.json();
        }

        let height = result.height.toString();
        let weight = result.weight.toString();
        let pname = result.forms[0].name.toString();
        let image = result.sprites.front_default.toString();

        const embed = new MessageEmbed()
            .setColor('#ffcb05')
            .setTitle('Pokedéx')
            .setDescription('Get yo mf info here')
            .setThumbnail(image)
            .addFields(
                { name: 'Name', value: pname, inline: true },
                { name: 'Height', value: height, inline: true },
                { name: 'Weight', value: weight, inline: true },
            )
            .setImage(image)
            .setTimestamp()
            .setFooter({ text: 'Brought to you by mfs at bradford', iconURL: image });
        msg.channel.send({ embeds: [embed] });
    }
    if (msg.content.startsWith("!")) {
        const string = msg.content.split("!");
        let pokemon = string[1];
        let url = "https://pokeapi.co/api/v2/pokemon/" + pokemon;
      fetch(url)
      .then(response => getData(response));
    }
  })

client.login(process.env.TOKEN);