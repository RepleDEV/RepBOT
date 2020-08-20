const db = require("../database");

function update_rows_by_user_id(user_id, fields) {
    // return new Promise(async (resolve, reject) => {
    //     if (typeof fields !== "object")return reject("VALUES PARAMETER NOT OBJECT TYPE");
    //     if (!user_id)return reject("user_id NOT SERVED")
    //     get_row_by_user_id(user_id).then(res => {
    //         let query;
    //         if (typeof res == "undefined" || res.length == 0) {
    //             query = `INSERT INTO currency (user_id, value, last_get) VALUES (${user_id},${fields.value}, ${fields.last_get})`;
    //         } else {
    //             query = `UPDATE currency SET value = ${res[0].value + fields.value} WHERE user_id = ${fields.user_id}`;
    //         }
    //         db.query(query).then(resolve).catch(reject);
    //     });
    // });
    return new Promise((resolve, reject) => {
        if (typeof fields !== "object")return reject("VALUES PARAMETER NOT OF OBJECT TYPE");
        if (!user_id)return reject("user_id PARAMETER OF UNDEFINED");
        var query = "UPDATE currency SET ";
        var keys = Object.keys(fields);
        keys.forEach((key, i) => {
            query += key + " = " + fields[key];
            query += i < keys.length - 1 ? ", " : " WHERE user_id=" + user_id;
        });
        db.query(query).then(resolve).catch(reject); 
    });
}

async function get_row_by_user_id(user_id) {
    if (!user_id)return -1;
    return await db.query(`SELECT * FROM currency WHERE user_id=${user_id}`);
}

async function create_new(user_id) {
    if (!user_id)return -1;
    return await db.query(`INSERT INTO currency (user_id) VALUES (${user_id})`);
}

exports.get_row_by_user_id = get_row_by_user_id;
exports.update_rows_by_user_id = update_rows_by_user_id;
exports.create_new = create_new;