import * as Discord from "discord.js";
import * as mathjs from "mathjs";
import { Log } from "./log";
import * as chalk from "chalk";

const chalkDefaultColor = chalk.rgb(35, 247, 169);
const chalkSecondaryColor = chalk.rgb(35, 247, 84);

interface ListenCommand {
    id: any;
    cmd: (msg?: Discord.Message) => void;
    args?: Array<any>;
}

const listening: Array<ListenCommand> = [];
const messageCache: Array<any> = [];

class Command {
    static async exec(
        command: string,
        bot: Discord.Client,
        msg: Discord.Message,
        args: Array<any>
    ): Promise<string> {
        switch (command) {
            case "calc":
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
                }
                await Log.write(
                    chalkDefaultColor(
                        "Command issue error: Syntax error. Command issued: calc. AuthorID: "
                    ) + chalkSecondaryColor(msg.author.id),
                    `Command issue error: Syntax error. Command issued: calc. AuthorID: ${msg.author.id}`
                );
                break;
            case "log":
                if (msg.member.hasPermission("ADMINISTRATOR")) {
                    switch (args[0]) {
                        case "clearall":
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
                        `Command issue error: non-admin. Command issued: log clearall. AuthorID: ${msg.author.id}.`
                    );
                }
                break;
            case "ping":
                msg.channel.send(
                    `Ping! \`${
                        msg.createdTimestamp - Date.now()
                    }ms\`. WebAPI latency: \`${Math.round(bot.ws.ping)}ms\`.`
                );
                Log.write(`Command issued: ping. AuthorID: ${msg.author.id}`);
                break;
        }

        return command;
    }
}

export { listening, Command };
