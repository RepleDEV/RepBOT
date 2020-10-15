import * as fs from "fs/promises";
import * as path from "path";
import { getCurrentDate } from "./sub-functions";

class Log {
    static async write(msg: any): Promise<void> {
        await fs.mkdir(path.join(__dirname, "../../log/")).catch((err) => {
            // Catch the error so that it doesn't kill the program
        });

        const curdate = getCurrentDate("_");
        await fs.appendFile(
            path.join(__dirname, `../../log/${curdate + ".log"}`),
            msg + "\n"
        );
        console.log(msg);
    }
    static async clearDir(): Promise<void> {
        let dir;

        try {
            dir = await this.getLogDir();
        } catch (err) {
            return;
        }

        for (const file of dir) {
            fs.unlink(path.join(__dirname, `../../log/${file}`));
        }
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
