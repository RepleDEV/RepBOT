const migrations = require('../../modules/migrations');

let table_name = "currency";

async function create() {
    return await migrations.createTable(table_name, {
        id: "INT AUTO_INCREMENT PRIMARY KEY",
        user_id: "BIGINT",
        value: "BIGINT DEFAULT 0",
        last_get: "BIGINT DEFAULT 0"
    });
}

exports.create = create;
exports.table_name = table_name;