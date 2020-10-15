import * as fs from "fs/promises";
import * as path from "path";
import { getCurrentDate } from "./sub-functions";
import * as dotenv from "dotenv";

dotenv.config();

class Log {
    static async write(msg: any, write?: any): Promise<void> {
        return new Promise(async (resolve, reject) => {
            fs.mkdir(path.join(__dirname, "../../log/")).catch((err) => {
                if (err.code != "EEXIST") {
                    reject(err);
                }
            });
            const curdate = getCurrentDate("_");
            if (write === undefined) {
                await fs.appendFile(
                    path.join(__dirname, `../../log/${curdate + ".log"}`),
                    msg + "\n"
                );
            } else {
                await fs.appendFile(
                    path.join(__dirname, `../../log/${curdate + ".log"}`),
                    write + "\n"
                );
            }

            if (process.env.DEBUG.toUpperCase() == "TRUE") {
                console.log(msg);
            }
            resolve();
        });
    }
    static async clearDir(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.getLogDir()
                .then((dir) => {
                    for (const file of dir) {
                        fs.unlink(path.join(__dirname, `../../log/${file}`));
                    }
                    resolve();
                })
                .catch(reject);
        });
    }
    static async deleteFile(file: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            this.getLogDir()
                .then((dir) => {
                    if (dir.includes(file)) {
                        if (!file.endsWith(".log")) {
                            file += ".log";
                        }
                        fs.unlink(path.join(__dirname, `../../log/${file}`));
                    } else {
                        reject("No file found!");
                    }
                    resolve();
                })
                .catch(reject);
        });
    }
    static getLogDir(): Promise<Array<string>> {
        return new Promise(async (resolve, reject) => {
            fs.readdir(path.join(__dirname, "../../log/"))
                .then(resolve)
                .catch(reject);
        });
    }
}

export { Log };
