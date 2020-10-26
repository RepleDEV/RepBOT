function getCurrentDate(split = "/"): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    const yyyy = today.getFullYear();

    return mm + split + dd + split + yyyy;
}

class Encryption {
    static encryptRailFenceCipher(str: string, key = 3): string {
        const strlen = str.length;
        const arr = [];
        for (let i = 0; i < key; i++) {
            arr.push(new Array(strlen));
        }
        let isGoingDown = true;
        let row = 0;
        for (let i = 0; i < strlen; i++) {
            arr[row][i] = str[i];
            if (row == key - 1) isGoingDown = false;
            else if (row == 0) isGoingDown = true;

            if (isGoingDown) row++;
            else row--;
        }
        return arr.map((val) => val.join("")).join("");
    }
    static decryptRailFenceCipher(str: string, key = 3): string {
        const strlen = str.length;
        const arr = [];
        for (let i = 0; i < key; i++) {
            arr.push(new Array(strlen));
        }
        let isGoingDown = true;
        let currentChar = 0;
        for (let i = 0; i < key; i++) {
            let row = 0;
            for (let j = 0; j < strlen; j++) {
                if (row == i) {
                    arr[i][j] = str[currentChar];
                    currentChar++;
                }
                if (row == key - 1) isGoingDown = false;
                else if (row == 0) isGoingDown = true;

                if (isGoingDown) row++;
                else row--;
            }
        }
        let res = "";
        isGoingDown = true;
        let row = 0;
        for (let i = 0; i < str.length; i++) {
            res += arr[row][i];

            if (row == key - 1) isGoingDown = false;
            else if (row == 0) isGoingDown = true;

            if (isGoingDown) row++;
            else row--;
        }
        return res;
    }
}

class Random {
    static integer(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}

class BlackjackDeck {
    player1: Array<any>;
    player2: Array<any>;
    constructor() {
        const cTypes = ["C", "D", "H", "S"];
        const cValues = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        for (let i = 0;i < 3;i++) {
            for (let j = 0;j < 2;j++) {
                const randTypeIndex = Math.floor(Math.random() * cTypes.length);
                const randValIndex = Math.floor(Math.random() * cValues.length);
                this["player" + (i + 1)].push(cTypes[randTypeIndex] + cValues[randValIndex]);
            }
        }
    }
    static getCard(): string {
        const cTypes = ["C", "D", "H", "S"];
        const cValues = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

        const randTypeIndex = Math.floor(Math.random() * cTypes.length);
        const randValIndex = Math.floor(Math.random() * cValues.length);

        return cTypes[randTypeIndex] + cValues[randValIndex];
    }
}

export { getCurrentDate, Encryption, Random, BlackjackDeck };
