const Discord = require('discord.js');
const fs = require("fs").promises;
const path = require("path");
const db = require("./database/database");

require("dotenv").config();

var bot_options;
(async () => {

    await fs.readFile(
        path.join(__dirname, "/settings/settings.json"), 
        {encoding: "utf-8"}
    )
    .then(data => bot_options = JSON.parse(data).bot)
    .catch(console.error);

    const bot = new Discord.Client();

    const token = process.env.APP_KEY;
    if (!token) {
        console.log("NO TOKEN. CANCELLING");
        process.exit(0);
    }

    const PREFIX = bot_options.prefix.default;

    bot.on('ready', () => {
        console.log(`Bot started! Logged in as ${bot.user.tag}`);
    })

    bot.on('message', msg => {
        if (!msg.content.startsWith(PREFIX) || msg.author.bot)return;

        let cmds = msg.content
        .substring(PREFIX.length)
        .split(";")
        .map(x => x.split(" ").map(y => y.toLowerCase()));

        cmds.forEach(args => {
            switch (args[0]) {
                case "ping": 
                    msg.channel.send("pong!");
                    break;
            }
        });
    })

    bot.login(token);
})();