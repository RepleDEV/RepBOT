const Discord = require('discord.js');
const fs = require("fs").promises;
const path = require("path");
const mysql = require("mysql");

require("dotenv").config();

var db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

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
        throw "NO TOKEN PROVIDED. CANCELLING";
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
                case "give":
                    break;
                case "debug":
                    db.connect(err => {
                        if (err)throw err;
                        db.query("SELECT * FROM currency", (err, res) => {
                            if (err)throw err;
                            msg.channel.send("Result: " + res);
                        });
                    });
                    break;
            }
        });
    })

    bot.login(token);
})();