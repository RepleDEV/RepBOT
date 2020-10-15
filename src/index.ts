import * as Discord from "discord.js";
import { promises as fs } from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { functions, Command, listening, Log } from "./modules";
import * as chalk from "chalk";

const chalkDefaultColor = chalk.rgb(35, 247, 169);
const chalkSecondaryColor = chalk.rgb(35, 247, 84);

const { getCurrentDate } = functions;

dotenv.config();

const bot = new Discord.Client();

(async function main() {
    const bot_config = JSON.parse(
        await fs.readFile(path.join(__dirname, "../config/config.json"), {
            encoding: "utf-8",
        })
    );

    const token = process.env.APP_KEY;
    if (!token) throw new Error("NO TOKEN PROVIDED");

    const prefix = bot_config.prefix.default;

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
        Log.write(
            chalkDefaultColor("Bot started. Logged in as: ") +
                chalkSecondaryColor(bot.user.tag),
            `Bot started. Logged in as: ${bot.user.tag}`
        );
    });

    bot.on("message", async (msg) => {
        if (listening.length > 0) {
            const del: Array<number> = [];
            for (let i = 0; i < listening.length; i++) {
                const { id, cmd } = listening[0];
                if (id == msg.author.id) {
                    cmd(msg);
                    del.push(i);
                }
            }
            for (const d of del) {
                listening.splice(d, 1);
            }
            return;
        }
        if (
            !msg.content.startsWith(prefix) ||
            (msg.author.bot && listening.length == 0)
        )
            return;
        const args = msg.content
            .substring(prefix.length)
            .split(" ")
            .map((v) => v.toLowerCase());

        await Command.exec(args[0], bot, msg, args.slice(1));
    });

    bot.login(token);
})();
