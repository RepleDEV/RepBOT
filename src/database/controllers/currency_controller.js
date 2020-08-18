const db = require("../database");

function updateFields(fields) {
    return new Promise(async (resolve, reject) => {
        if (typeof fields !== "object")return reject("VALUES PARAMETER NOT OBJECT TYPE");
        await checkForUser().then(res => {
            if(res[0].user_id !== fields.user_id) {
                let query = `INSERT INTO currency (`;

                let keys = Object.keys(fields);
                keys.forEach((field, i) => {
                    query += field;
                    query += i < keys.length - 1 ? "," : ") VALUES (";
                });
                keys.forEach((field, i ) => {
                    query += fields[field];
                    query += i < keys.length - 1 ? "," : ");";
                });
            }
        });
    });
}

async function checkForUser(user_id) {
    return await db.query(`SELECT * FROM currency WHERE user_id=${user_id}`);
}