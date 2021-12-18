import * as Discord from "discord.js";
import { promises as fs } from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { functions, Command, listening, Log } from "./modules";
import * as chalk from "chalk";

// Chalk stdout colors
const chalkDefaultColor = chalk.rgb(35, 247, 169);
const chalkSecondaryColor = chalk.rgb(35, 247, 84);

const { getCurrentDate } = functions;

// Parse .env file
dotenv.config();

const bot = new Discord.Client();

// Async auto exec main function
(async function main() {
    // Parse config.json file
    const bot_config = JSON.parse(
        await fs.readFile(path.join(__dirname, "../config/config.json"), {
            encoding: "utf-8",
        })
    );

    // Get token from .env file
    const token = process.env.APP_KEY;

    // Checks if token exists
    if (!token) throw new Error("NO TOKEN PROVIDED");

    // Get prefix from the bot config
    const prefix = bot_config.prefix.default;

    // Write to log: new session
    Log.write(
        chalkDefaultColor("[Session: ") +
            chalkSecondaryColor`${Date.now()} | ${getCurrentDate()}` +
            chalkDefaultColor("]"),
        `[Session: ${Date.now()} | ${getCurrentDate()}]`
    );
    Log.write(
        chalkDefaultColor("Starting with prefix: ") +
            chalkSecondaryColor(prefix),
        `Starting with prefix: ${prefix}.`
    );

    bot.on("ready", () => {
        // Write to log that the bot's ready
        Log.write(
            chalkDefaultColor("Bot started. Logged in as: ") +
                chalkSecondaryColor(bot.user.tag),
            `Bot started. Logged in as: ${bot.user.tag}`
        );
    });

    bot.on("message", async (msg) => {
        // Checks if there's any commands that are being listened to
        if (listening.length > 0) {
            // Temporary deletion array.
            const del: Array<number> = [];

            let doReturn = false;

            // For each listening command that has the same id as the message's author
            for (let i = 0; i < listening.length; i++) {
                const { id, messageId, cmd } = listening[0];

                if (id == msg.author.id && messageId == msg.channel.id) {
                    // Callback the listening function
                    cmd(msg);
                    // Push the index to the deletion array
                    del.push(i);

                    doReturn = true;
                }
            }

            // Delete everything that was being listened to
            for (const d of del) {
                listening.splice(d, 1);
            }

            if (doReturn) {
                return;
            }
        }

        /**
         * Checks if the message starts with the prefix
         * Also checks if the message author is a bot
         * AND if there's nothing being listened to
         */
        if (
            !msg.content.startsWith(prefix) ||
            (msg.author.bot && listening.length == 0)
        )
            return;

        // Get the arguments
        const args = msg.content
            .substring(prefix.length) // Remove the prefix
            .split(" ") // Split it by spaces
            .map((v) => v.toLowerCase()); // Make every word/argument lowercase

        // Execute said commands
        await Command.exec(args[0], bot, msg, args.slice(1));
    });

    // Login with the token
    bot.login(token);
})();
