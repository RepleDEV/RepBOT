import * as fs from "fs/promises";
import * as path from "path";
import { getCurrentDate } from "./sub-functions";

class Log {
    static async write(msg: any): Promise<void> {
        const curdate = getCurrentDate("_");
        fs.appendFile(
            path.join(__dirname, `../../log/${curdate + ".log"}`),
            msg + "\n"
        );
        console.log(msg);
    }
    static async clearDir(): Promise<void> {
        const logDir = await fs.readdir(path.join(__dirname, "../../log/"));
        for (const file of logDir) {
            fs.unlink(path.join(__dirname, `../../log/${file}`));
        }
    }
}

export { Log };
