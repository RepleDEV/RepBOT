import * as Discord from "discord.js";
import * as mathjs from "mathjs";
import { Log } from "./log";
import * as chalk from "chalk";
import { Encryption, Random } from "./sub-functions";
import { promises as fs } from "fs";
import * as path from "path";

// Chalk stdout colors
const chalkDefaultColor = chalk.rgb(35, 247, 169);
const chalkSecondaryColor = chalk.rgb(35, 247, 84);

interface ListenerObject {
    /**
     * Message Author ID
     */
    id: any;
    /**
     * Command Callback
     */
    cmd: (msg?: Discord.Message) => void;
    /**
     * Optional arguments
     */
    args?: Array<any>;
}

/**
 * Listening array
 */
const listening: Array<ListenerObject> = [];
const messageCache: Array<any> = [];

/**
 * Command class for executing commands
 */
class Command {
    /**
     * Execute discord bot commands
     * @param command Command to execute
     * @param bot Bot parameter
     * @param msg Message object
     * @param args Rest of the arguments
     */
    static async exec(
        command: string,
        bot: Discord.Client,
        msg: Discord.Message,
        args: Array<any>
    ): Promise<string> {
        const bot_config = JSON.parse(await fs.readFile(path.join(__dirname, "../../config/config.json"), {encoding: "utf-8"}));

        switch (command) {
            /**
             * Calculate math
             */
            case "calc":
                // Using trycatch so that if the mathjs evaluation gets a SyntaxError it won't kill the program
                try {
                    const mathEval = mathjs.evaluate(args.join(""));
                    msg.channel.send(`Result: ${mathEval}`);
                    await Log.write(
                        chalkDefaultColor("Command issued: calc. AuthorID: ") +
                        chalkSecondaryColor(msg.author.id),
                        `Command issued: calc. AuthorID: ${msg.author.id}.`
                    );
                } catch (error) {
                    msg.channel.send("Calc error: Syntax error");
                    await Log.write(
                        chalkDefaultColor(
                            "Command issue error: Syntax error. Command issued: calc. AuthorID: "
                        ) + chalkSecondaryColor(msg.author.id),
                        `Command issue error: Syntax error. Command issued: calc. AuthorID: ${msg.author.id}`
                    );
                }
                break;
            /**
             * Bot logging controll
             */
            case "log":
                if (bot_config.log.allowedUsers.includes(parseInt(msg.author.id))) {
                    switch (args[0]) {
                        case "clearall":
                            // Checks if the arguments includes the flags "-y" or "--yes"
                            if (args.includes("-y") || args.includes("--yes")) {
                                await Log.clearDir();
                                msg.channel.send("Cleared logs");
                                Log.write(
                                    chalkDefaultColor(
                                        "Command issued: log clearall. AuthorID: "
                                    ) + chalkSecondaryColor(msg.author.id),
                                    `Command issued: log clearall. AuthorID: ${msg.author.id}.`
                                );
                            } else {
                                msg.channel.send(
                                    "Please confirm by replying with `y`."
                                );
                                listening.push({
                                    id: msg.author.id,
                                    cmd: (m: Discord.Message) => {
                                        if (
                                            m.content == "y" ||
                                            m.content == "yes"
                                        ) {
                                            Command.exec("log", bot, msg, [
                                                "clearall",
                                                "-y",
                                            ]);
                                        }
                                    },
                                });
                                Log.write(
                                    chalkDefaultColor("Command listener added: log clearall. AuthorID: ") + chalkSecondaryColor(msg.author.id),
                                    `Command listener added: log clearall. AuthorID: ${msg.author.id}.`
                                );
                            }
                            break;
                        case "view":
                            break;
                    }
                } else {
                    msg.channel.send("Error: non-admin");
                    Log.write(
                        chalkDefaultColor("Command issue error: non-admin. Command issued: log clearall. AuthorID: ") + chalkSecondaryColor(msg.author.id),
                        `Command issue error: non-admin. Command issued: log clearall. AuthorID: ${msg.author.id}.`
                    );
                }
                break;
            case "ping":
                msg.channel.send(
                    `Ping! \`${
                        Date.now() - msg.createdTimestamp
                    }ms\`. WebAPI latency: \`${Math.round(bot.ws.ping)}ms\`.`
                );
                Log.write(
                    chalkDefaultColor("Command issued: ping. AuthorID: ") + chalkSecondaryColor(msg.author.id),
                    `Command issued: ping. AuthorID: ${msg.author.id}`
                );
                break;
            case "encrypt":
                switch (args[0]) {
                    case "rail":
                        if (args[1] != "fence") break;

                        if (args.length < 2) {
                            msg.channel.send(
                                "Bruh u needa encrypt something smh"
                            );
                            break;
                        }

                        msg.channel.send(
                            `Encryption results: \`${Encryption.encryptRailFenceCipher(
                                args.splice(2).join(" ")
                            )}\``
                        );
                        break;
                    default:
                        msg.channel.send(
                            "Bruh u gotta specify the encryption method. Try again maybe. \n||Btw we only got `rail fence` as our only encryption AND decryption method. sooooo||"
                        );
                        break;
                }
                break;
            case "decrypt":
                switch (args[0]) {
                    case "rail":
                        if (args[1] != "fence") break;

                        if (args.length < 2) {
                            msg.channel.send(
                                "Bruh u needa encrypt something smh"
                            );
                            break;
                        }

                        msg.channel.send(
                            `Decryption results: \`${Encryption.decryptRailFenceCipher(
                                args.splice(2).join(" ")
                            )}\``
                        );
                        break;
                    default:
                        msg.channel.send(
                            "Bruh u gotta specify the decryption method. Try again maybe. \n||Btw we only got `rail fence` as our only encryption AND decryption method. sooooo||"
                        );
                        break;
                }
                break;
            case "rng":
                if (!args.length) {
                    msg.channel.send("You need to specify how big your number can be.\n\nSyntax: `rb.rng <int: minimum?> <int: maximum>`.");
                    break;
                }
                if (args.length == 1) {
                    const maxNum = parseInt(args[0])
                    if (isNaN(maxNum)) {
                        msg.channel.send("Aruments must be a number.\n\nSyntax: `rb.rng <int: minimum?> <int: maximum>`.");
                        break;
                    }
                    const rng = Random.integer(1, maxNum);
                    msg.channel.send(`RNG Results: \`${rng}\`.`)
                } else {
                    const minNum = parseInt(args[0]);
                    const maxNum = parseInt(args[1]);
                    if (isNaN(minNum)|| isNaN(maxNum)) {
                        msg.channel.send("Aruments must be a number.\n\nSyntax: `rb.rng <int: minimum?> <int: maximum>`.");
                        break;
                    }
                    const rng = Random.integer(minNum, maxNum);
                    msg.channel.send(`RNG Results: \`${rng}\`.`)
                }
                break;
            case "help":
                msg.channel.send(
                    "**RepBOT Help**" +
                    "\n\n" +
                    "**CALC** >> Calculate math!" +
                    "\n" +
                    "**PING** >> Measure network latency and/or performance!" +
                    "\n" +
                    "**ENCRYPT** >> Encryption! Available encryption methods: **Rail Fence**" +
                    "\n" +
                    "**DECRYPT** >> Decryption! Available decryption methods: **Rail Fence**"
                );
                break;
        }

        return command;
    }
}

export { listening, Command };
