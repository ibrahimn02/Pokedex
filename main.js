//This is needed to use "require" whilst our type is set to module for node-fetch
import { createRequire } from "module";
const require = createRequire(import.meta.url);

//Bringing in dependencies
const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js');
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});
require('dotenv').config()
import fetch from 'node-fetch';

//When the bot is active, display message and set bot activity/status
client.on('ready', () => {
    console.log('Pokédex is online!');
    client.user.setActivity("Pokémon", { type: 'PLAYING' });
});

client.on("messageCreate", msg => {
    //Async function to make sure we wait for our response before we go any further
    async function getData(response){
        
        //If the user inputs an invalid name display error message. 
        if(response.status == 404){
            console.log("NOT FOUND");
            msg.channel.send("Pokémon not found");
            return;
            
            //else continue with formatting the JSON
        } else{
            result = await response.json();
        }

        //Global Variables declaration
        let name = "";
        let image = '';
        let result;

        //Set info variables and assign them to their values from the JSON data api response
        let height = result.height.toString();
        let weight = result.weight.toString();
        let pname = result.forms[0].name.toString();
        let front = result.sprites.front_default.toString();

        //Generic embed message to send with values shown from the info variables (taken from the API)
        const embed = new MessageEmbed()
            .setColor('#ffcb05')
            .setTitle('Pokedéx')
            .addFields(
                { name: 'Name', value: pname },
                { name: 'Height', value: height },
                { name: 'Weight', value: weight },
            )
            .setImage(front)
            .setTimestamp()
            .setFooter({ text: `Gotta catch 'em all!`});

        //Sends the embed message
        msg.channel.send({ embeds: [embed] });
    }
    
    //If the message starts with the prefix, split the user input into two (as an array): the prefix and the name of the pokemon
    if (msg.content.startsWith("!")) {
        const string = msg.content.split("!");
        //Assign pokemon variable the input which should be a pokemon with the prefix removed
        let pokemon = string[1];
        
        //Concatenates the user input, aka pokemon, onto the API url
        //We then call the API and send the reponse to our getData() function which handles checking the data all the way to assigning the values to the info variables
        let url = "https://pokeapi.co/api/v2/pokemon/" + pokemon;
      fetch(url)
      .then(response => getData(response));
    }
  })

//Login to the bot using the token (from the environment variable located in the .env file at the root directory)
client.login(process.env.TOKEN);