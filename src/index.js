const Discord = require('discord.js');
const bot = new Discord.Client();

const token = 'NjU2NDUxMjg5ODk0NDg2MDE2.XpQMag.V49etJWwH_gOuaFmadN1QnvhX7o';

const PREFIX = "->";

bot.on('ready', () => {
    console.log(`Bot started! Logged in as ${bot.user.tag}`);
})

bot.on('message', msg => {
    let args = msg.content.substring(PREFIX.length).split(" ")
    
    switch (args[0]) {
        // case 'greet':
        //     let author = msg.author;
        //     msg.channel.send(`Hello there ${author}`);
        //     break;
        // case 'spin':
        //     var rng = Math.floor(Math.random() * 100);
        //     msg.channel.send("Spinning!");
        //     setTimeout(() => msg.channel.send(" Spun " + rng + "!"), 3000);
        case "support":
            
    }
})

bot.login(token);