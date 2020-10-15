import * as Discord from "discord.js";
import * as mathjs from "mathjs";
import { Log } from "./log";

interface ListenCommand {
    id: any;
    cmd: (msg?: Discord.Message) => void;
    args?: Array<any>;
}

const listening: Array<ListenCommand> = [];

class Command {
    static async exec(
        command: string,
        bot: Discord.Client,
        msg: Discord.Message,
        ...args: Array<any>
    ): Promise<string> {
        switch (command) {
            case "calc":
                msg.channel.send(
                    `Result: ${mathjs.evaluate(args[0].join(""))}`
                );
                await Log.write(
                    `Command issued: calc. AuthorID: ${msg.author.id}.`
                );
                break;
            case "log":
                switch (args[0][0]) {
                    case "clearall":
                        if (msg.member.hasPermission("ADMINISTRATOR")) {
                            if (
                                args[0].includes("-y") ||
                                args[0].includes("--yes")
                            ) {
                                await Log.clearDir();
                                msg.channel.send("Cleared logs");
                                Log.write(
                                    `Command issued: log clearall. AuthorID: ${msg.author.id}.`
                                );
                            } else {
                                msg.channel.send("Confirm. Yay or nay");
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
                        } else {
                            msg.channel.send("Error: non-admin");
                            Log.write(
                                `Command issue error: non-admin. Command: log clearall. AuthorID: ${msg.author.id}.`
                            );
                        }
                        break;
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
