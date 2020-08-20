const Discord = require('discord.js');
const fs = require("fs").promises;
const path = require("path");
const db = require("./database/database");
// const cmds = require("./modules/commands");
const checkMigrated = require('./modules/migrations').checkMigrated;

const currency_controller = require("./database/controllers/currency_controller");

require("dotenv").config();

const bot = new Discord.Client();

var bot_options;
(async () => {
    console.log("Preparing startup...");
    await checkMigrated().then(isMigrated => {
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

        cmds.forEach(async args => {
            let asyncTest;
            switch(args[0]) {
                case "get":
                    var res,val;
                    await currency_controller.get_row_by_user_id(msg.author.id).then(x => res = x).catch(console.error);

                    if (typeof res == "undefined" || res.length == 0) {
                        await currency_controller.create_new(msg.author.id);
                        val = Math.floor(Math.random() * 500) + 1;
                    } else if (res[0].last_get == 0) {
                        val = Math.floor(Math.random() * 500) + 1;
                    } else {
                        val = Math.sqrt((Date.now() - res[0].last_get) / 10);
                        val = Math.floor(val);
                        val += res[0].value;
                    }
                    await currency_controller.update_rows_by_user_id(msg.author.id, {
                        value: val,
                        last_get: Date.now()
                    });
                    var currentBal;
                    await currency_controller.get_row_by_user_id(msg.author.id).then(res => currentBal = res[0].value).catch(console.error);
                    msg.channel.send(`Added **${val - res[0].value}** coins to your balance! Current balance: **${currentBal}**`);
                    asyncTest = "HH";
                    break;
    
                case "bal":
                    var currentBal;
                    await currency_controller.get_row_by_user_id(msg.author.id).then(res => currentBal = res).catch(console.error);
    
                    if (typeof currentBal == "undefined" || currentBal.length == 0) {
                        await currency_controller.create_new(msg.author.id);
                        await currency_controller.get_row_by_user_id(msg.author.id).then(res => currentBal = res).catch(console.error);
                    }
    
                    currentBal = currentBal[0].value;
    
                    msg.channel.send(`Current balance for: **${msg.author.username}** equals to **${typeof currentBal == "undefined" ? 0 : currentBal}**`);
                    asyncTest = "HH";
                    break;
            }
        });
    })

    bot.login(token);
})();