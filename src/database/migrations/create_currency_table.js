const migrations = require('../../modules/migrations');

async function create() {
    return await migrations.createTable("currency", {
        id: "INT AUTO_INCREMENT PRIMARY KEY",
        user_id: "BIGINT",
        value: "BIGINT"
    });
}

exports.create = create;