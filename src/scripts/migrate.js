const fs = require('fs').promises;
const migrations = require("../modules/migrations");

async function migrate() {
    await checkMigrated().then(res => {
        if (res) {
            return "Already Migrated!";
        }
    });

    console.log("Migrating...!");
    await require("../database/database").migrate().catch(console.error);
}

async function checkMigrated() {
    let tables = [];

    var files;

    var normalizedPath = require("path").join(__dirname, "../database/migrations");
    await require("fs").promises.readdir(normalizedPath).then(res => files = res).catch(console.error);

    files.forEach(async file => {
        tables.push(require("../database/migrations/" + file).table_name);
    });

    let table_b;
    await require("../database/database").showTables().then(res => table_b = res).catch(console.error);

    return arraysEqual(tables, table_b);
}

// Stackoverflow COPYPASTA TYSM
function arraysEqual(x, y) {
    let a = x, b = y;

    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
  
    a.sort();
    b.sort();

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

exports.checkMigrated = checkMigrated;

// migrate().then(console.log).catch(console.error);