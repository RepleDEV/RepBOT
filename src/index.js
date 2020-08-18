const Discord = require('discord.js');
const fs = require("fs").promises;
const path = require("path");
const db = require("./database/database");
const cmds = require("./modules/commands");
const migrate = require('./scripts/migrate');

const currency_controller = require("./database/controllers/currency_controller");

require("dotenv").config();

const bot = new Discord.Client();

var bot_options;
(async () => {
    await migrate.checkMigrated().then(isMigrated => {
        if (!isMigrated)console.log("Database not migrated! (This may cause problems)");
    }).catch(console.error)

    await fs.readFile(
        path.join(__dirname, "/settings/settings.json"), 
        {encoding: "utf-8"}
    )
    .then(data => bot_options = JSON.parse(data).bot)
    .catch(console.error);

    const token = process.env.APP_KEY;
    if (!token) {
        throw "NO TOKEN PROVIDED. CANCELLING";
    }

    const PREFIX = bot_options.prefix.default;

    console.log(`Starting with prefix: ${PREFIX}`);

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
            switch(args[0]) {
                case "get":
                    let res = Math.floor(Math.random() * 500) + 1;
                    msg.channel.send(res);
                    break;
            }
        });
    })

    bot.login(token);
})();