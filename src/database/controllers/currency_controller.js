const db = require("../database");

function addCurrency(fields) {
    return new Promise(async (resolve, reject) => {
        if (typeof fields !== "object")return reject("VALUES PARAMETER NOT OBJECT TYPE");
        if (!fields.user_id)return reject("user_id NOT SERVED")
        get_row_by_user_id(fields.user_id).then(res => {
            let query;
            if (res.length == 0) {
                query = `INSERT INTO currency (user_id, value) VALUES (${fields.user_id},${fields.value})`;
            } else {
                query = `UPDATE currency SET value = ${res[0].value + fields.value} WHERE user_id = ${fields.user_id}`;
            }
            db.query(query).then(resolve).catch(reject);
        });
    });
}

async function get_row_by_user_id(user_id) {
    if (!user_id)return -1;
    return await db.query(`SELECT * FROM currency WHERE user_id=${user_id}`);
}

exports.get_row_by_user_id = get_row_by_user_id;
exports.addCurrency = addCurrency;